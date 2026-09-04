"""
Pydantic request/response models shared across the API.

Keeping these in one place means the frontend team (Person 1) and the
backend/integration team (Person 3) both know the exact contract without
having to read the AI code.
"""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class AnswerRequest(BaseModel):
    question: str = Field(..., description="The exact text of the form question.")
    type: str = Field(
        default="text",
        description="One of: 'text' (direct fact / open-ended) or 'multiple_choice'.",
    )
    options: List[str] = Field(
        default_factory=list,
        description="Choices available, only used when type == 'multiple_choice'.",
    )
    user_profile: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Optional profile override. If omitted, the demo profile.json is used.",
    )


class AnswerResponse(BaseModel):
    answer: Optional[str] = None
    selected_option: Optional[str] = None
    confidence: float
    needs_user: bool
    status: str  # "auto_fill" | "review" | "needs_user"
    reason: str
    matched_fields: List[str] = Field(default_factory=list)


class HealthResponse(BaseModel):
    status: str
