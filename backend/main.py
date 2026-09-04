"""
FormZero backend entrypoint.

Run locally with:
    uvicorn main:app --reload --port 8000

(from inside the backend/ directory, with the virtualenv activated and
requirements.txt installed).
"""
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from routes.answer import router as answer_router  # noqa: E402  (after load_dotenv)

app = FastAPI(
    title="FormZero API",
    description="Understands form questions and answers them from a saved user profile.",
    version="0.1.0",
)

# Wide-open CORS for the hackathon demo. Tighten this (specific origins) before
# any real deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(answer_router)


@app.get("/")
def root():
    return {
        "service": "FormZero API",
        "docs": "/docs",
        "health": "/health",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)), reload=True)
