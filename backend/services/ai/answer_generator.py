"""
answer_generator.py
--------------------
Given an Analysis (from analyzer.py) and the user's profile, produces a raw
answer dict. This module owns two answer paths:

1. DETERMINISTIC LOOKUP - for direct_fact and multiple_choice questions where
   analyzer.py already found a matching profile field, we just read the value
   straight out of the profile. No LLM call, no hallucination risk, instant.

2. LLM GENERATION - for open_ended questions, or any question where the
   deterministic path found nothing, we ask the model to generate a natural
   answer using ONLY the relevant slice of the profile we hand it.

If OPENAI_API_KEY is not configured, the LLM path degrades to a simple
template-based fallback so the whole pipeline (and the demo) still works
end-to-end without a key -- it just produces lower-confidence, more generic
answers, which the validator will correctly route to "review" instead of
"auto_fill".

validator.py is responsible for turning this raw dict into the final,
safety-checked response -- this module does not decide auto_fill vs review.
"""
import json
import os
from typing import Any, Dict, List, Optional

from .analyzer import Analysis
from .prompts import SYSTEM_PROMPT, build_user_prompt

MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")


def _get_nested(profile: Dict[str, Any], path: str):
    node = profile
    for part in path.split("."):
        if isinstance(node, dict) and part in node:
            node = node[part]
        else:
            return None
    return node


def _stringify(value: Any) -> Optional[str]:
    if value is None:
        return None
    if isinstance(value, list):
        if not value and not all(isinstance(v, dict) for v in value):
            return None
        if value and isinstance(value[0], dict):
            # e.g. experience: [{"role": ..., "description": ...}]
            parts = []
            for item in value:
                parts.append(", ".join(f"{k}: {v}" for k, v in item.items()))
            return "; ".join(parts)
        return ", ".join(str(v) for v in value)
    return str(value)


def _build_context(profile: Dict[str, Any], fields: List[str]) -> Dict[str, Any]:
    """Pulls only the relevant slice of the profile for LLM context, per the
    'minimize irrelevant information leakage' requirement."""
    if not fields:
        # Safe generic fallback context for open-ended questions with no
        # clearly matched field: bio + interests only (never the full profile).
        fields = ["bio", "interests"]
    context = {}
    for f in fields:
        val = _get_nested(profile, f)
        if val is not None:
            context[f] = val
    return context


def _deterministic_lookup(fields: List[str], profile: Dict[str, Any]):
    for f in fields:
        val = _get_nested(profile, f)
        text = _stringify(val)
        if text:
            return text, f
    return None, None


def _match_option(value: str, options: List[str]) -> Optional[str]:
    if not value:
        return None
    value_l = value.lower()
    for opt in options:
        if opt.lower() == value_l or opt.lower() in value_l or value_l in opt.lower():
            return opt
    return None


def _call_llm(question: str, context: Dict[str, Any], options: List[str]) -> Optional[Dict[str, Any]]:
    """Calls the OpenAI Responses API. Returns a parsed dict, or None if the
    call fails / is unavailable (caller must handle the None fallback)."""
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return None

    try:
        from openai import OpenAI

        client = OpenAI(api_key=api_key)
        user_prompt = build_user_prompt(question, context, options)

        response = client.responses.create(
            model=MODEL,
            input=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            text={"format": {"type": "json_object"}},
        )

        raw_text = getattr(response, "output_text", None)
        if not raw_text:
            # Fallback extraction in case the SDK shape differs by version.
            raw_text = "".join(
                block.text
                for item in getattr(response, "output", [])
                for block in getattr(item, "content", [])
                if getattr(block, "type", "") == "output_text"
            )
        if not raw_text:
            return None

        cleaned = raw_text.strip().strip("`")
        if cleaned.startswith("json"):
            cleaned = cleaned[4:].strip()
        return json.loads(cleaned)
    except Exception as exc:  # noqa: BLE001 - hackathon-grade catch-all, logged below
        print(f"[FormZero] LLM call failed, falling back: {exc}")
        return None


def _template_fallback(question: str, context: Dict[str, Any]) -> Dict[str, Any]:
    """Used when there's no API key, or the LLM call failed. Produces a
    best-effort, clearly-lower-confidence answer from bio/interests so the
    demo still works offline, while validator.py will route it to review
    rather than auto-fill."""
    bio = context.get("bio")
    interests = context.get("interests")
    education = context.get("education.field") or context.get("education")

    if not bio and not interests and not education:
        return {
            "answer": None,
            "confidence": 0.1,
            "needs_user": True,
            "reason": "No relevant profile information found and no AI model configured.",
        }

    pieces = []
    if bio:
        pieces.append(str(bio))
    if interests:
        pieces.append(f"I'm particularly interested in {_stringify(interests)}.")

    answer = " ".join(pieces) if pieces else None
    return {
        "answer": answer,
        "confidence": 0.65 if answer else 0.1,
        "needs_user": answer is None,
        "reason": "Template fallback used (OPENAI_API_KEY not set) - please review before submitting.",
    }


def generate(question: str, analysis: Analysis, profile: Dict[str, Any], options: List[str]) -> Dict[str, Any]:
    """Main entry point used by the /answer route. Returns a RAW answer dict
    (not yet validated/clamped -- that happens in validator.py)."""

    if analysis.qtype == "multiple_choice":
        looked_up, field_used = _deterministic_lookup(analysis.matched_fields, profile)
        matched_option = _match_option(looked_up, options) if looked_up else None
        if matched_option:
            return {
                "answer": matched_option,
                "selected_option": matched_option,
                "confidence": 0.95,
                "needs_user": False,
                "reason": f"Matched profile field '{field_used}' to a provided option.",
            }
        # No deterministic match -- ask the LLM to choose using relevant context.
        context = _build_context(profile, analysis.matched_fields)
        llm_result = _call_llm(question, context, options)
        if llm_result and llm_result.get("answer") in options:
            llm_result["selected_option"] = llm_result["answer"]
            return llm_result
        return {
            "answer": None,
            "selected_option": None,
            "confidence": 0.2,
            "needs_user": True,
            "reason": "Could not confidently match any option to the user's profile.",
        }

    if analysis.qtype == "direct_fact":
        looked_up, field_used = _deterministic_lookup(analysis.matched_fields, profile)
        if looked_up:
            return {
                "answer": looked_up,
                "confidence": 0.97,
                "needs_user": False,
                "reason": f"Direct lookup from profile field '{field_used}'.",
            }
        # Field wasn't in the profile at all -- do NOT guess.
        return {
            "answer": None,
            "confidence": 0.05,
            "needs_user": True,
            "reason": "The required information is not available in the user profile.",
        }

    # open_ended
    context = _build_context(profile, analysis.matched_fields)
    llm_result = _call_llm(question, context, options)
    if llm_result:
        return llm_result
    return _template_fallback(question, context)
