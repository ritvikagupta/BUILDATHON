"""
API routes for FormZero.

Kept separate from main.py so Person 3 (backend/integration) can extend the
API surface (auth, saved-answer history, per-question approval, etc.) without
touching AI internals, and Person 2 (AI) can iterate on services/ai/ without
touching routing/app setup.
"""
import json
import os
from typing import Any, Dict

from fastapi import APIRouter, HTTPException

from models.schemas import AnswerRequest, AnswerResponse, HealthResponse
from services.ai import analyzer, answer_generator, validator

router = APIRouter()

_PROFILE_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "profile.json")


def _load_default_profile() -> Dict[str, Any]:
    try:
        with open(_PROFILE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Could not load default profile.json: {exc}",
        )


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok")


@router.post("/answer", response_model=AnswerResponse)
def answer_question(payload: AnswerRequest) -> AnswerResponse:
    question = (payload.question or "").strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question must not be empty.")

    profile = payload.user_profile if payload.user_profile else _load_default_profile()
    if not isinstance(profile, dict) or not profile:
        raise HTTPException(status_code=400, detail="A valid, non-empty user_profile is required.")

    options = payload.options or []
    if payload.type == "multiple_choice" and not options:
        raise HTTPException(
            status_code=400,
            detail="type=='multiple_choice' requires a non-empty options list.",
        )

    try:
        analysis = analyzer.analyze(question, declared_type=payload.type, options=options)
        raw_answer = answer_generator.generate(question, analysis, profile, options)
    except Exception as exc:  # noqa: BLE001
        # Never crash the app because of an AI/provider hiccup -- degrade gracefully.
        raw_answer = {
            "answer": None,
            "confidence": 0.0,
            "needs_user": True,
            "reason": "FormZero AI is temporarily unavailable. Please try again.",
        }
        print(f"[FormZero] /answer failed for question={question!r}: {exc}")
        analysis = analyzer.Analysis(qtype=payload.type or "text", matched_fields=[])

    validated = validator.validate(
        raw_answer,
        qtype=analysis.qtype,
        options=options,
        matched_fields=analysis.matched_fields,
    )
    return AnswerResponse(**validated)
