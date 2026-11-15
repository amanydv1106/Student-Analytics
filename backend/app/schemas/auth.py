from typing import Optional
from pydantic import BaseModel, Field

class StudentRegister(BaseModel):
    email: str = Field(min_length=5, description="Student email address")
    password: str = Field(min_length=6, description="Password must be at least 6 characters")
    full_name: str = Field(min_length=2, description="Student's full name")
    student_id: Optional[str] = Field(default="", description="Roll number or student enrollment ID")
    program: str = Field(default="Computer Science", description="Degree program enrolled")
    semester: int = Field(default=4, ge=1, le=8, description="Current semester (1-8)")
    institution_id: int = Field(default=3, ge=0, le=9, description="Campus/Institution ID (0-9)")

class StudentLogin(BaseModel):
    email: str = Field(min_length=5, description="Student email address")
    password: str

class StudentProfile(BaseModel):
    id: int
    email: str
    full_name: str
    student_id: Optional[str] = ""
    program: str
    semester: int
    institution_id: int
    created_at: Optional[str] = None

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: StudentProfile
