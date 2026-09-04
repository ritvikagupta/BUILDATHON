import os
import sys

# Make `backend/` importable as the project root so `from services.ai import ...`
# and `from models.schemas import ...` work the same way they do in main.py.
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest


@pytest.fixture
def sample_profile():
    return {
        "name": "Alex Sharma",
        "email": "alex@example.com",
        "phone": "+91XXXXXXXXXX",
        "education": {
            "degree": "B.Tech",
            "field": "Computer Science",
            "institution": "Example University",
            "graduation_year": 2028,
        },
        "skills": ["Python", "JavaScript", "React", "Machine Learning"],
        "experience": [
            {"role": "Student Developer", "description": "Built web apps and AI projects."}
        ],
        "bio": "Computer Science student interested in AI and software development.",
        "interests": ["Artificial Intelligence", "Web Development", "Hackathons"],
        "preferences": {
            "work_mode": "Hybrid",
            "interested_in": ["AI", "Software Development", "Hackathons"],
        },
    }


@pytest.fixture(autouse=True)
def no_openai_key(monkeypatch):
    """Ensure tests run deterministically without hitting the real OpenAI API."""
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
