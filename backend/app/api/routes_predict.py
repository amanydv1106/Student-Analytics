from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.app.schemas.student import (
    StudentInput, PredictionResult,
    BatchPredictionResponse, BatchItemResult,
    SimulationRequest, SimulationResponse
)
from backend.app.services.predictor import predictor_service

router = APIRouter(prefix="/api", tags=["Prediction & Simulation"])

PRESET_STUDENTS = {
    "high_performer": StudentInput(
        institution_id=2, program="Computer Science", semester=4, age=21,
        study_hours_per_day=6.0, attendance_pct=94.0, previous_gpa=8.8,
        assignment_completion_pct=96.0, internal_marks=89.0, sleep_hours=7.5,
        commute_minutes=20.0, internet_access="Reliable",
        parental_education="Postgraduate", extracurricular_level="High",
        financial_pressure="Low", part_time_job="No", lms_logins=45,
        missed_deadlines=0
    ),
    "average_student": StudentInput(
        institution_id=4, program="Science", semester=3, age=22,
        study_hours_per_day=3.5, attendance_pct=78.0, previous_gpa=6.8,
        assignment_completion_pct=75.0, internal_marks=68.0, sleep_hours=6.5,
        commute_minutes=45.0, internet_access="Reliable",
        parental_education="Undergraduate", extracurricular_level="Medium",
        financial_pressure="Medium", part_time_job="No", lms_logins=18,
        missed_deadlines=1
    ),
    "at_risk_student": StudentInput(
        institution_id=7, program="Commerce", semester=2, age=23,
        study_hours_per_day=1.5, attendance_pct=52.0, previous_gpa=4.8,
        assignment_completion_pct=45.0, internal_marks=42.0, sleep_hours=4.5,
        commute_minutes=85.0, internet_access="Limited",
        parental_education="School", extracurricular_level="Low",
        financial_pressure="High", part_time_job="Yes", lms_logins=6,
        missed_deadlines=5
    )
}

@router.post("/predict", response_model=PredictionResult)
def predict_student(student: StudentInput):
    """Predict final score and evaluate academic risk for an individual student."""
    try:
        return predictor_service.predict(student)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sample-students", response_model=Dict[str, StudentInput])
def get_sample_students():
    """Retrieve pre-configured realistic student profiles for rapid testing."""
    return PRESET_STUDENTS

@router.post("/batch-predict", response_model=BatchPredictionResponse)
def batch_predict(students: List[StudentInput]):
    """Execute prediction pipeline on multiple students at once."""
    if not students:
        raise HTTPException(status_code=400, detail="Student list cannot be empty.")

    results: List[BatchItemResult] = []
    at_risk_count = 0
    total_score = 0.0

    for idx, s in enumerate(students):
        res = predictor_service.predict(s)
        if res.risk_status == "CRITICAL AT RISK":
            at_risk_count += 1
        total_score += res.predicted_score
        results.append(BatchItemResult(
            student_id=f"STU{idx+1:04d}",
            input=s,
            result=res
        ))

    total = len(students)
    return BatchPredictionResponse(
        total_students=total,
        at_risk_count=at_risk_count,
        safe_count=total - at_risk_count,
        average_predicted_score=round(total_score / total, 2),
        results=results
    )

@router.post("/simulate", response_model=SimulationResponse)
def simulate_scenario(request: SimulationRequest):
    """Simulate 'what-if' adjustments to attendance, study hours, or deadlines."""
    try:
        return predictor_service.simulate(request.base_student, request.simulated_changes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
