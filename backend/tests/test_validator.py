from services.ai import validator


def test_high_confidence_maps_to_auto_fill():
    raw = {"answer": "Computer Science", "confidence": 0.97, "needs_user": False, "reason": "ok"}
    result = validator.validate(raw, qtype="direct_fact")
    assert result["status"] == "auto_fill"
    assert result["needs_user"] is False


def test_mid_confidence_maps_to_review():
    raw = {"answer": "Maybe this", "confidence": 0.7, "needs_user": False, "reason": "ok"}
    result = validator.validate(raw, qtype="open_ended")
    assert result["status"] == "review"


def test_low_confidence_maps_to_needs_user():
    raw = {"answer": "guess", "confidence": 0.3, "needs_user": False, "reason": "low confidence"}
    result = validator.validate(raw, qtype="open_ended")
    assert result["status"] == "needs_user"
    assert result["needs_user"] is True


def test_confidence_is_clamped_to_0_1_range():
    raw = {"answer": "x", "confidence": 5, "needs_user": False, "reason": "bad model output"}
    result = validator.validate(raw, qtype="direct_fact")
    assert 0.0 <= result["confidence"] <= 1.0


def test_null_answer_cannot_be_auto_fill():
    raw = {"answer": None, "confidence": 0.99, "needs_user": False, "reason": "buggy model"}
    result = validator.validate(raw, qtype="direct_fact")
    assert result["status"] == "needs_user"


def test_multiple_choice_rejects_option_not_offered():
    raw = {"answer": "Astrophysics", "confidence": 0.9, "needs_user": False, "reason": "bad match"}
    result = validator.validate(
        raw, qtype="multiple_choice", options=["Computer Science", "Business"]
    )
    assert result["status"] == "needs_user"
    assert result["selected_option"] is None


def test_multiple_choice_accepts_valid_option():
    raw = {
        "answer": "Computer Science",
        "selected_option": "Computer Science",
        "confidence": 0.95,
        "needs_user": False,
        "reason": "matched",
    }
    result = validator.validate(
        raw, qtype="multiple_choice", options=["Computer Science", "Business"]
    )
    assert result["status"] == "auto_fill"
    assert result["selected_option"] == "Computer Science"
