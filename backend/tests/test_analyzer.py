from services.ai import analyzer


def test_direct_fact_field_of_study():
    result = analyzer.analyze("What is your current field of study?")
    assert result.qtype == "direct_fact"
    assert "education.field" in result.matched_fields


def test_direct_fact_email():
    result = analyzer.analyze("What is your email?")
    assert result.qtype == "direct_fact"
    assert result.primary_field == "email"


def test_multiple_choice_detected_from_options():
    result = analyzer.analyze(
        "What is your field?",
        declared_type="text",
        options=["Computer Science", "Mechanical Engineering", "Civil Engineering"],
    )
    assert result.qtype == "multiple_choice"


def test_open_ended_tell_us_about_yourself():
    result = analyzer.analyze("Tell us about yourself.")
    assert result.qtype == "open_ended"


def test_open_ended_why_interested():
    result = analyzer.analyze("Why are you interested in this event?")
    assert result.qtype == "open_ended"
    assert "interests" in result.matched_fields


def test_unknown_question_has_no_matched_fields():
    result = analyzer.analyze("What is your passport number?")
    assert result.matched_fields == []
