from typing import List, Dict, Optional
from pydantic import BaseModel, Field

class StudentInput(BaseModel):
    institution_id: int = Field(default=3, ge=0, le=9, description="Institution ID (0 to 9)")
    program: str = Field(default="Computer Science", description="Degree Program")
    semester: int = Field(default=4, ge=1, le=8, description="Current Semester")
    age: int = Field(default=22, ge=17, le=45, description="Student Age")
    study_hours_per_day: float = Field(default=4.5, ge=0.0, le=24.0, description="Daily self-study hours")
    attendance_pct: float = Field(default=82.0, ge=0.0, le=100.0, description="Class attendance percentage")
    previous_gpa: float = Field(default=7.2, ge=0.0, le=10.0, description="Previous cumulative GPA out of 10")
    assignment_completion_pct: float = Field(default=88.0, ge=0.0, le=100.0, description="Assignment submission percentage")
    internal_marks: float = Field(default=76.0, ge=0.0, le=100.0, description="Internal assessment marks out of 100")
    sleep_hours: float = Field(default=7.0, ge=2.0, le=14.0, description="Average sleep per night")
    commute_minutes: float = Field(default=35.0, ge=0.0, le=300.0, description="One-way commute time in minutes")
    internet_access: str = Field(default="Reliable", description="'Reliable', 'Limited', or 'No access'")
    parental_education: str = Field(default="Undergraduate", description="'School', 'Undergraduate', or 'Postgraduate'")
    extracurricular_level: str = Field(default="Medium", description="'Low', 'Medium', or 'High'")
    financial_pressure: str = Field(default="Low", description="'Low', 'Medium', or 'High'")
    part_time_job: str = Field(default="No", description="'Yes' or 'No'")
    lms_logins: int = Field(default=20, ge=0, le=200, description="Monthly Learning Management System logins")
    missed_deadlines: int = Field(default=1, ge=0, le=50, description="Number of missed deadlines this semester")

class PredictionResult(BaseModel):
    predicted_score: float
    score_grade: str
    at_risk_probability: float
    hybrid_risk_index: float
    risk_status: str  # SAFE, MODERATE WARNING, CRITICAL AT RISK
    risk_color: str   # #10b981 (green), #f59e0b (amber), #ef4444 (red)
    recommendations: List[str]
    key_strengths: List[str]
    risk_factors: List[str]

class BatchItemResult(BaseModel):
    student_id: Optional[str] = None
    input: StudentInput
    result: PredictionResult

class BatchPredictionResponse(BaseModel):
    total_students: int
    at_risk_count: int
    safe_count: int
    average_predicted_score: float
    results: List[BatchItemResult]

class SimulationDelta(BaseModel):
    feature: str
    original_value: float
    modified_value: float

class SimulationRequest(BaseModel):
    base_student: StudentInput
    simulated_changes: Dict[str, float]

class SimulationResponse(BaseModel):
    original_score: float
    simulated_score: float
    score_diff: float
    original_risk: float
    simulated_risk: float
    risk_diff: float
    original_status: str
    simulated_status: str
    feedback: str
