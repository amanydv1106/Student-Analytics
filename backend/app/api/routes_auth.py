from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any
from backend.app.schemas.auth import StudentRegister, StudentLogin, AuthResponse, StudentProfile
from backend.app.core.security import hash_password, verify_password, create_access_token, decode_access_token
from backend.app.core.database import get_connection

router = APIRouter(prefix="/api/auth", tags=["Student Authentication"])
security_bearer = HTTPBearer(auto_error=False)

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer)) -> Dict[str, Any]:
    """Dependency to retrieve and authenticate student from JWT bearer token."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required. Please sign in."
        )
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid token. Please log in again."
        )
    try:
        user_id = int(payload["sub"])
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token subject."
        )
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, email, full_name, student_id, program, semester, institution_id, created_at FROM users WHERE id = ?", (user_id,))
    row = cur.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Student account not found.")

    return dict(row)

@router.post("/register", response_model=AuthResponse)
def register_student(payload: StudentRegister):
    """Register a new student account."""
    conn = get_connection()
    cur = conn.cursor()

    # Check if email is already taken
    cur.execute("SELECT id FROM users WHERE email = ?", (payload.email.lower(),))
    if cur.fetchone():
        conn.close()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="An account with this email already exists.")

    hashed_pw = hash_password(payload.password)
    cur.execute("""
    INSERT INTO users (email, password_hash, full_name, student_id, program, semester, institution_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        payload.email.lower(),
        hashed_pw,
        payload.full_name.strip(),
        payload.student_id.strip() if payload.student_id else "",
        payload.program,
        payload.semester,
        payload.institution_id
    ))
    conn.commit()
    user_id = cur.lastrowid

    cur.execute("SELECT id, email, full_name, student_id, program, semester, institution_id, created_at FROM users WHERE id = ?", (user_id,))
    user_row = dict(cur.fetchone())
    conn.close()

    token = create_access_token({"sub": user_id, "email": user_row["email"]})
    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=StudentProfile(**user_row)
    )

@router.post("/login", response_model=AuthResponse)
def login_student(payload: StudentLogin):
    """Authenticate student and issue JWT session token."""
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, email, password_hash, full_name, student_id, program, semester, institution_id, created_at FROM users WHERE email = ?", (payload.email.lower(),))
    user = cur.fetchone()
    conn.close()

    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password. Please try again."
        )

    user_dict = dict(user)
    user_id = user_dict["id"]
    token = create_access_token({"sub": user_id, "email": user_dict["email"]})

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=StudentProfile(
            id=user_dict["id"],
            email=user_dict["email"],
            full_name=user_dict["full_name"],
            student_id=user_dict["student_id"],
            program=user_dict["program"],
            semester=user_dict["semester"],
            institution_id=user_dict["institution_id"],
            created_at=str(user_dict["created_at"])
        )
    )

@router.get("/me", response_model=StudentProfile)
def get_logged_in_student(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieve profile of the currently signed-in student."""
    return StudentProfile(**current_user)
