# FormZero

**Stop filling forms. Start submitting.**

AI that understands a form question and answers it from your saved profile —
without ever inventing information it doesn't actually have.

## Problem

People retype the same handful of facts about themselves — name, degree,
school, skills, "tell us about yourself," "why are you interested" — into
dozens of near-identical forms: applications, registrations, sign-ups.

## Solution

FormZero reads a form question, works out which part of your profile is
relevant, and either:
- answers it directly (when it's confident), or
- flags it for you to fill in yourself (when it isn't) —

and never guesses at sensitive or missing information.

```
FORM
  ↓
UNDERSTAND QUESTION
  ↓
FIND RELEVANT USER INFORMATION
  ↓
GENERATE ANSWER
  ↓
VALIDATE / CONFIDENCE
  ↓
AUTO-FILL OR ASK USER
```

## Why this fits the hackathon prompt

The prompt asks for something that makes a repetitive workflow *disappear*,
not another chatbot bolted onto it. FormZero doesn't wait for you to ask it
questions — it looks at a form you were already going to fill out, decides
what it can safely answer on your behalf, and only interrupts you for the
handful of fields it genuinely can't fill in. The demo makes this visible in
one click: ten questions go from blank to (mostly) answered, with a clear,
color-coded distinction between "trust this," "check this," and "you have to
do this one."

## Features

- Rule-based question understanding (fast, deterministic, testable) with an
  LLM fallback for open-ended questions
- Profile-aware answers that pull only the relevant slice of your data —
  never dumps your whole profile into every answer
- Multiple-choice matching against the exact options a form offers
- Confidence scoring with a hard safety rule: no answer, no confidence
- Human-in-the-loop fallback — anything uncertain is left for you, not guessed
- Works end-to-end even without an OpenAI API key configured (degrades to a
  template-based answer for open-ended questions, correctly marked "review")

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for the full pipeline
diagram and design rationale.

```
formzero/
├── backend/
│   ├── main.py                  # FastAPI app entrypoint
│   ├── routes/answer.py         # POST /answer, GET /health
│   ├── services/ai/
│   │   ├── analyzer.py          # question type + relevant field detection
│   │   ├── answer_generator.py  # deterministic lookup + LLM fallback
│   │   ├── prompts.py           # system prompt, isolated for easy tuning
│   │   └── validator.py         # confidence clamping + status mapping
│   ├── models/schemas.py        # shared Pydantic request/response models
│   ├── data/profile.json        # sample demo profile (fake data)
│   └── tests/                   # pytest suite for analyzer/generator/validator
└── frontend/
    └── src/
        ├── pages/Home.jsx
        ├── components/{FormZeroForm,QuestionCard,ConfidenceBadge}.jsx
        └── services/api.js      # single place backend URL/auth is configured
```

## Tech stack

- **Frontend:** React + Vite (JavaScript)
- **Backend:** Python + FastAPI
- **AI:** OpenAI Responses API (model configurable via `OPENAI_MODEL`)
- **Data:** local JSON for the MVP, structured so it's a drop-in swap for a database later

## Installation

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env          # then optionally fill in OPENAI_API_KEY
uvicorn main:app --reload --port 8000
```

Backend runs at `http://localhost:8000` (interactive docs at `/docs`).

### Frontend

```bash
cd frontend
npm install
cp ../.env.example .env          # only VITE_API_URL is used here
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Environment variables

| Variable          | Where           | Purpose                                       |
|-------------------|-----------------|------------------------------------------------|
| `OPENAI_API_KEY`  | `backend/.env`  | Enables LLM-generated answers. Optional — the app works without it (see architecture doc). |
| `OPENAI_MODEL`    | `backend/.env`  | Defaults to `gpt-4o-mini`.                     |
| `PORT`            | `backend/.env`  | Backend port, defaults to `8000`.              |
| `VITE_API_URL`    | `frontend/.env` | Backend base URL, defaults to `http://localhost:8000`. |

`.env` files are gitignored; `.env.example` is committed as the template.

## Example API request

```bash
curl -X POST http://localhost:8000/answer \
  -H "Content-Type: application/json" \
  -d '{"question": "What is your current field of study?", "type": "text", "options": []}'
```

## Example API response

```json
{
  "answer": "Computer Science",
  "selected_option": null,
  "confidence": 0.97,
  "needs_user": false,
  "status": "auto_fill",
  "reason": "Direct lookup from profile field 'education.field'.",
  "matched_fields": ["education.field"]
}
```

For an unanswerable question (e.g. "What is your passport number?"):

```json
{
  "answer": null,
  "selected_option": null,
  "confidence": 0.05,
  "needs_user": true,
  "status": "needs_user",
  "reason": "The required information is not available in the user profile.",
  "matched_fields": []
}
```

## Running tests

```bash
cd backend
pytest
```

Covers: direct profile lookup, open-ended generation (with and without an
API key), multiple-choice matching, unknown questions, missing profile
fields, and validator confidence/status logic (including malformed model
output).

## Future improvements

- Browser extension to autofill real third-party forms (Google Forms,
  Typeform, job/scholarship/event applications)
- User-editable profile UI instead of a static `profile.json`
- Per-question approval before submission + saved answer history
- Swap local JSON for a real database

## Team roles

| Person | Area |
|--------|------|
| Person 1 | Frontend — UI/UX, dashboard, form interface |
| Person 2 | AI Engineer — question understanding, answer generation, confidence scoring |
| Person 3 | Backend/Integration — API, data handling, frontend↔AI wiring |

The repo is structured so each area (`frontend/`, `backend/services/ai/`,
`backend/routes/` + `backend/models/`) can be worked on independently.
