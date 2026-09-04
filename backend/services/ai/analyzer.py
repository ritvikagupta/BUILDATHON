"""
analyzer.py
-----------
Understands a form question well enough to know:
  1. what *type* of question it is (multiple_choice / direct_fact / open_ended)
  2. which part(s) of the user's profile are relevant to it

This is deliberately rule-based rather than an LLM call. A hackathon demo
needs to be fast and deterministic for the common case (name/email/degree/
etc.), and keeping this logic explicit means it's easy to extend and to
unit test without needing an API key.

Anything this module can't confidently classify falls through to
answer_generator.py, which decides whether to call the LLM.
"""
from dataclasses import dataclass, field
from typing import List, Optional

# Maps a profile "field path" (dot notation into the profile dict) to the
# keywords that, if present in a question, suggest that field is relevant.
# Order matters slightly: more specific keywords are listed first so they
# win over generic ones when a question could match multiple entries.
FIELD_KEYWORDS = [
    ("name", ["full name", "your name", "what is your name"]),
    ("email", ["email", "e-mail"]),
    ("phone", ["phone", "contact number", "mobile"]),
    ("education.field", ["field of study", "major", "what do you study", "your field"]),
    ("education.degree", ["degree", "qualification"]),
    ("education.institution", ["university", "college", "institution", "school"]),
    ("education.graduation_year", ["graduation year", "year of graduation", "when do you graduate"]),
    ("skills", ["skills", "programming languages", "technologies", "tech stack", "what languages"]),
    ("experience", ["experience", "worked on", "have you worked", "your role"]),
    ("bio", ["about yourself", "who are you", "introduce yourself", "tell us about you"]),
    ("interests", ["interested in", "your interests", "hobbies", "why are you interested"]),
    ("preferences.work_mode", ["work mode", "remote", "hybrid", "onsite", "in-office"]),
]

OPEN_ENDED_TRIGGERS = [
    "tell us about",
    "tell me about",
    "why are you interested",
    "why do you want",
    "describe your",
    "describe yourself",
    "what motivates",
    "why should we",
]


@dataclass
class Analysis:
    qtype: str  # "multiple_choice" | "direct_fact" | "open_ended"
    matched_fields: List[str] = field(default_factory=list)
    primary_field: Optional[str] = None


def _lower(s: str) -> str:
    return s.lower().strip()


def classify_question_type(question: str, declared_type: str, options: List[str]) -> str:
    """Decide the working question type.

    `declared_type` comes from the caller (frontend/backend) and is trusted
    for multiple_choice since the options list is authoritative. Otherwise
    we infer direct_fact vs open_ended from question phrasing.
    """
    if declared_type == "multiple_choice" or options:
        return "multiple_choice"

    q = _lower(question)
    if any(trigger in q for trigger in OPEN_ENDED_TRIGGERS):
        return "open_ended"

    # Direct fact questions are typically short "what is your X" style.
    if q.startswith("what is your") or q.startswith("what's your") or q.startswith("what do you"):
        return "direct_fact"

    # Default: if we recognize a specific field keyword, treat as direct_fact,
    # otherwise assume open_ended (safer: triggers relevant-context generation
    # rather than a blind field lookup that could return the wrong thing).
    for _, keywords in FIELD_KEYWORDS:
        if any(kw in q for kw in keywords):
            return "direct_fact"
    return "open_ended"


def find_relevant_fields(question: str) -> List[str]:
    """Returns profile field paths whose keywords appear in the question,
    ordered by relevance (first match = most relevant)."""
    q = _lower(question)
    matches = []
    for field_path, keywords in FIELD_KEYWORDS:
        if any(kw in q for kw in keywords):
            matches.append(field_path)
    return matches


def analyze(question: str, declared_type: str = "text", options: Optional[List[str]] = None) -> Analysis:
    options = options or []
    qtype = classify_question_type(question, declared_type, options)
    matched = find_relevant_fields(question)
    primary = matched[0] if matched else None
    return Analysis(qtype=qtype, matched_fields=matched, primary_field=primary)
