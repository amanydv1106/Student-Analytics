import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_student_registration_and_login():
    # 1. Register student
    test_email = "teststudent_2026@university.edu"
    reg_payload = {
        "email": test_email,
        "password": "Password123",
        "full_name": "Jordan Lee",
        "student_id": "CS-2026-999",
        "program": "Computer Science",
        "semester": 4,
        "institution_id": 3
    }
    res = client.post("/api/auth/register", json=reg_payload)
    assert res.status_code in [200, 400]  # 400 if already created in previous run
    
    # 2. Login
    login_payload = {
        "email": test_email,
        "password": "Password123"
    }
    res_login = client.post("/api/auth/login", json=login_payload)
    assert res_login.status_code == 200
    auth_data = res_login.json()
    assert "access_token" in auth_data
    assert auth_data["user"]["email"] == test_email
    token = auth_data["access_token"]

    # 3. Verify /me
    headers = {"Authorization": f"Bearer {token}"}
    res_me = client.get("/api/auth/me", headers=headers)
    assert res_me.status_code == 200
    assert res_me.json()["full_name"] == "Jordan Lee"

    # 4. Generate Student Report
    report_input = {
        "internal_marks": 82.0,
        "attendance_pct": 88.0,
        "assignment_completion_pct": 90.0,
        "study_hours_per_day": 5.0,
        "previous_gpa": 7.8,
        "lms_logins": 28,
        "missed_deadlines": 0,
        "sleep_hours": 7.5,
        "commute_minutes": 25.0,
        "internet_access": "Reliable",
        "financial_pressure": "Low",
        "part_time_job": "No",
        "extracurricular_level": "Medium"
    }
    res_rep = client.post("/api/student/report", json=report_input, headers=headers)
    assert res_rep.status_code == 200
    rep_data = res_rep.json()
    assert "predicted_score" in rep_data
    assert "executive_summary" in rep_data
    assert "best_strengths" in rep_data
    assert len(rep_data["best_strengths"]) > 0
    assert "preparation_priorities" in rep_data
    assert "component_breakdown" in rep_data
    assert len(rep_data["component_breakdown"]) == 5

    # 5. Fetch report history
    res_hist = client.get("/api/student/history", headers=headers)
    assert res_hist.status_code == 200
    hist_data = res_hist.json()
    assert len(hist_data) >= 1
    assert hist_data[0]["predicted_score"] == rep_data["predicted_score"]

def test_demo_student_login():
    res = client.post("/api/auth/login", json={"email": "demo@student.edu", "password": "demo1234"})
    assert res.status_code == 200
    data = res.json()
    assert data["user"]["full_name"] == "Demo Student"
