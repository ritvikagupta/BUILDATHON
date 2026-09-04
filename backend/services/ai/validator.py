"""
validator.py
------------
Final safety gate before anything reaches the frontend. Owns:

- clamping/typechecking whatever answer_generator.py (or the LLM) produced
- the confidence -> status mapping (auto_fill / review / needs_user)
- multiple-choice option validation (never return a choice that wasn't
  actually offered)

Nothing here should ever let a hallucinated or malformed answer through
unflagged -- if in doubt, this module downgrades confidence rather than
upgrades it.
"""
from typing import Any, Dict, List, Optional

AUTO_FILL_THRESHOLD = 0.85
REVIEW_THRESHOLD = 0.60


def _status_for(confidence: float, needs_user: bool) -> str:
    if needs_user or confidence < REVIEW_THRESHOLD:
        return "needs_user"
    if confidence >= AUTO_FILL_THRESHOLD:
        return "auto_fill"
    return "review"


def _clamp(value: Any, default: float = 0.0) -> float:
    try:
        v = float(value)
    except (TypeError, ValueError):
        return default
    return max(0.0, min(1.0, v))


def validate(
    raw: Dict[str, Any],
    qtype: str,
    options: Optional[List[str]] = None,
    matched_fields: Optional[List[str]] = None,
) -> Dict[str, Any]:
    options = options or []
    matched_fields = matched_fields or []

    answer = raw.get("answer")
    selected_option = raw.get("selected_option")
    confidence = _clamp(raw.get("confidence", 0))
    needs_user = bool(raw.get("needs_user", False))
    reason = raw.get("reason") or "No reason provided."

    # An empty/None answer can never be needs_user=False.
    if answer is None and not needs_user:
        needs_user = True
        confidence = min(confidence, 0.2)
        reason = reason + " (auto-corrected: empty answer cannot be auto-filled)"

    # Multiple choice: the selected option MUST be one of the offered options.
    if qtype == "multiple_choice":
        candidate = selected_option or answer
        if candidate not in options:
            answer = None
            selected_option = None
            needs_user = True
            confidence = min(confidence, 0.2)
            reason = "Model output did not match any of the provided options; flagged for user review."
        else:
            selected_option = candidate
            answer = candidate

    status = _status_for(confidence, needs_user)
    # Keep needs_user consistent with the derived status for the frontend.
    needs_user = status == "needs_user"

    return {
        "answer": answer,
        "selected_option": selected_option,
        "confidence": round(confidence, 2),
        "needs_user": needs_user,
        "status": status,
        "reason": reason,
        "matched_fields": matched_fields,
    }
