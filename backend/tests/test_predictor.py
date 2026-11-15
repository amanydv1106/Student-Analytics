import pytest
from backend.app.schemas.student import StudentInput
from backend.app.services.predictor import predictor_service

def test_high_performer_prediction():
    student = StudentInput(
        institution_id=2, program="Computer Science", semester=4, age=21,
        study_hours_per_day=6.0, attendance_pct=95.0, previous_gpa=8.8,
        assignment_completion_pct=96.0, internal_marks=90.0, sleep_hours=8.0,
        commute_minutes=15.0, internet_access="Reliable",
        parental_education="Postgraduate", extracurricular_level="High",
        financial_pressure="Low", part_time_job="No", lms_logins=40,
        missed_deadlines=0
    )
    result = predictor_service.predict(student)
    assert result.predicted_score >= 70.0
    assert result.at_risk_probability < 0.20
    assert result.risk_status == "SAFE"
    assert result.risk_color == "#10b981"
    assert len(result.key_strengths) > 0

def test_at_risk_student_prediction():
    student = StudentInput(
        institution_id=7, program="Commerce", semester=2, age=23,
        study_hours_per_day=1.0, attendance_pct=45.0, previous_gpa=4.5,
        assignment_completion_pct=40.0, internal_marks=38.0, sleep_hours=4.5,
        commute_minutes=90.0, internet_access="Limited",
        parental_education="School", extracurricular_level="Low",
        financial_pressure="High", part_time_job="Yes", lms_logins=4,
        missed_deadlines=6
    )
    result = predictor_service.predict(student)
    assert result.predicted_score < 70.0
    assert result.at_risk_probability > 0.40
    assert result.risk_status in ["MODERATE WARNING", "CRITICAL AT RISK"]
    assert len(result.risk_factors) > 0
    assert len(result.recommendations) > 0

def test_simulation_scenario():
    base = StudentInput(
        study_hours_per_day=2.0, attendance_pct=60.0, missed_deadlines=4
    )
    changes = {
        "study_hours_per_day": 5.0,
        "attendance_pct": 90.0,
        "missed_deadlines": 0
    }
    sim = predictor_service.simulate(base, changes)
    assert sim.simulated_score > sim.original_score
    assert sim.simulated_risk < sim.original_risk
    assert sim.score_diff > 0
