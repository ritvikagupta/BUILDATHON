# FormZero Architecture

## Pipeline

```
FORM QUESTION
      |
      v
[analyzer.py]        -> classify question type (direct_fact / multiple_choice / open_ended)
      |                  and find which profile fields are relevant
      v
[answer_generator.py] -> deterministic profile lookup first;
      |                  falls back to an LLM call (OpenAI Responses API) scoped
      |                  to ONLY the relevant profile fields, for open-ended
      |                  questions or anything the deterministic path can't answer
      v
[validator.py]        -> clamps confidence, enforces multiple-choice option
      |                  validity, and maps confidence -> status
      v
AUTO_FILL / REVIEW / NEEDS_USER
```

## Why deterministic-first?

Most form questions ("What is your email?", "What university do you attend?")
have exactly one correct answer that already lives in the profile verbatim.
Calling an LLM for these would be slower, costlier, and adds a (small but
nonzero) hallucination surface for no benefit. FormZero only calls the model
when there genuinely isn't a direct field to read from: open-ended questions,
or multiple-choice questions where the profile doesn't literally contain one
of the offered strings.

## Why a template fallback with no API key?

Hackathon demos should not go dark because a `.env` wasn't set up in time.
When `OPENAI_API_KEY` is missing, open-ended questions still get answered
using the profile's `bio` / `interests` fields via a simple template — at a
capped confidence that routes to "review" rather than "auto_fill", so the
safety guarantee (never silently present an unreviewed guess as fact) still
holds.

## Confidence -> status mapping

| Confidence | Status      | Frontend behavior                          |
|-----------:|-------------|---------------------------------------------|
| >= 0.85    | auto_fill   | Field is filled in, shown as accepted       |
| 0.60–0.84  | review      | Field is filled in, but flagged to check    |
| < 0.60     | needs_user  | Field is left blank, highlighted for input  |

This mapping lives in one place (`validator.py`) so it can be tuned without
touching analyzer or generator logic.

## Extension points (future work, not built in the MVP)

- Swap `data/profile.json` for a real database — `routes/answer.py` already
  isolates all profile loading behind `_load_default_profile()`.
- Browser extension / Google Forms / Typeform integrations would call the
  same `POST /answer` contract; no backend changes needed.
- Per-question approval and saved answer history are additive: they'd sit in
  a new `routes/history.py` and a small persistence layer, without touching
  `services/ai/`.
