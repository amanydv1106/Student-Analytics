from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class StudentReportInput(BaseModel):
    internal_marks: float = Field(default=75.0, ge=0.0, le=100.0, description="Internal assessment marks (0-100)")
    attendance_pct: float = Field(default=82.0, ge=0.0, le=100.0, description="Class lecture attendance %")
    assignment_completion_pct: float = Field(default=85.0, ge=0.0, le=100.0, description="Assignment submission %")
    study_hours_per_day: float = Field(default=4.5, ge=0.0, le=24.0, description="Daily self-study hours")
    previous_gpa: float = Field(default=7.5, ge=0.0, le=10.0, description="Previous term GPA out of 10")
    lms_logins: int = Field(default=22, ge=0, le=200, description="Monthly LMS course logins")
    missed_deadlines: int = Field(default=1, ge=0, le=50, description="Missed assignment deadlines this semester")
    sleep_hours: float = Field(default=7.0, ge=2.0, le=14.0, description="Average daily sleep hours")
    commute_minutes: float = Field(default=30.0, ge=0.0, le=300.0, description="One-way commute minutes")
    internet_access: str = Field(default="Reliable", description="'Reliable', 'Limited', or 'No access'")
    financial_pressure: str = Field(default="Low", description="'Low', 'Medium', or 'High'")
    part_time_job: str = Field(default="No", description="'Yes' or 'No'")
    extracurricular_level: str = Field(default="Medium", description="'Low', 'Medium', or 'High'")

class ComponentMetric(BaseModel):
    name: str
    score: float
    grade_label: str
    status: str
    color: str
    feedback: str

class StudentPerformanceReport(BaseModel):
    report_id: Optional[int] = None
    student_name: str
    student_id: Optional[str] = ""
    program: str
    semester: int
    predicted_score: float
    score_grade: str
    at_risk_probability: float
    hybrid_risk_index: float
    risk_status: str
    risk_color: str
    executive_summary: str
    best_strengths: List[str]
    preparation_priorities: List[str]
    component_breakdown: List[ComponentMetric]
    created_at: str

class ReportHistoryItem(BaseModel):
    id: int
    predicted_score: float
    score_grade: str
    risk_status: str
    risk_color: str
    created_at: str
