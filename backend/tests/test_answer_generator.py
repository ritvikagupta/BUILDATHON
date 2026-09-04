from services.ai import analyzer, answer_generator


def test_deterministic_direct_fact_lookup(sample_profile):
    analysis = analyzer.analyze("What is your current field of study?")
    result = answer_generator.generate(
        "What is your current field of study?", analysis, sample_profile, []
    )
    assert result["answer"] == "Computer Science"
    assert result["confidence"] >= 0.9
    assert result["needs_user"] is False


def test_multiple_choice_matches_profile_value(sample_profile):
    options = ["Computer Science", "Mechanical Engineering", "Civil Engineering", "Business"]
    analysis = analyzer.analyze("What is your field?", declared_type="text", options=options)
    result = answer_generator.generate("What is your field?", analysis, sample_profile, options)
    assert result["selected_option"] == "Computer Science"
    assert result["confidence"] >= 0.9


def test_unknown_direct_fact_does_not_hallucinate(sample_profile):
    analysis = analyzer.analyze("What is your passport number?")
    result = answer_generator.generate(
        "What is your passport number?", analysis, sample_profile, []
    )
    assert result["answer"] is None
    assert result["needs_user"] is True
    assert result["confidence"] < 0.6


def test_open_ended_without_api_key_uses_template_fallback(sample_profile):
    analysis = analyzer.analyze("Tell us about yourself.")
    result = answer_generator.generate("Tell us about yourself.", analysis, sample_profile, [])
    # No OPENAI_API_KEY in test env (see conftest.no_openai_key) -> template fallback.
    assert result["answer"] is not None
    assert "Computer Science student" in result["answer"]
    assert result["confidence"] < 0.85  # must not silently qualify for auto-fill


def test_missing_profile_field_flags_needs_user(sample_profile):
    del sample_profile["email"]
    analysis = analyzer.analyze("What is your email?")
    result = answer_generator.generate("What is your email?", analysis, sample_profile, [])
    assert result["answer"] is None
    assert result["needs_user"] is True
