from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"

def test_sample_students_endpoint():
    response = client.get("/api/sample-students")
    assert response.status_code == 200
    data = response.json()
    assert "high_performer" in data
    assert "at_risk_student" in data

def test_predict_endpoint():
    payload = {
        "institution_id": 3,
        "program": "Computer Science",
        "semester": 4,
        "age": 22,
        "study_hours_per_day": 5.0,
        "attendance_pct": 85.0,
        "previous_gpa": 7.5,
        "assignment_completion_pct": 85.0,
        "internal_marks": 78.0,
        "sleep_hours": 7.0,
        "commute_minutes": 30.0,
        "internet_access": "Reliable",
        "parental_education": "Undergraduate",
        "extracurricular_level": "Medium",
        "financial_pressure": "Low",
        "part_time_job": "No",
        "lms_logins": 25,
        "missed_deadlines": 1
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_score" in data
    assert "at_risk_probability" in data
    assert "hybrid_risk_index" in data
    assert "risk_status" in data
    assert "recommendations" in data

def test_leaderboard_endpoint():
    response = client.get("/api/models/leaderboard")
    assert response.status_code == 200
    data = response.json()
    assert "regression_models" in data
    assert "classification_models" in data
    assert len(data["regression_models"]) > 0

def test_simulate_endpoint():
    payload = {
        "base_student": {
            "study_hours_per_day": 2.0,
            "attendance_pct": 65.0,
            "missed_deadlines": 4
        },
        "simulated_changes": {
            "study_hours_per_day": 5.5,
            "attendance_pct": 92.0,
            "missed_deadlines": 0
        }
    }
    response = client.post("/api/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["score_diff"] > 0
    assert data["risk_diff"] < 0
