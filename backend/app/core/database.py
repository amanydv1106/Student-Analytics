"""Database initialization and connection management for Student Portal."""
import os
import sqlite3
import json
from pathlib import Path
from typing import Optional, Dict, Any, List
from backend.app.core.config import BACKEND_DIR
from backend.app.core.security import hash_password

# Database path (stored in backend/data)
DB_PATH = BACKEND_DIR / "data" / "student_portal.db"

def get_connection() -> sqlite3.Connection:
    """Provide a thread-safe connection to the SQLite database with Row factory."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database tables and create default demo student account if not present."""
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Users / Students table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        student_id TEXT,
        program TEXT DEFAULT 'Computer Science',
        semester INTEGER DEFAULT 4,
        institution_id INTEGER DEFAULT 3,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 2. Student Evaluation Reports table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        input_data TEXT NOT NULL,
        predicted_score REAL NOT NULL,
        score_grade TEXT NOT NULL,
        risk_status TEXT NOT NULL,
        at_risk_prob REAL NOT NULL,
        hybrid_risk_index REAL NOT NULL,
        summary_report TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    """)

    cursor.execute("CREATE INDEX IF NOT EXISTS idx_reports_user_id ON student_reports(user_id)")

    # 3. Seed demo student if none exists
    cursor.execute("SELECT id FROM users WHERE email = 'demo@student.edu'")
    demo_user = cursor.fetchone()
    if not demo_user:
        hashed = hash_password("demo1234")
        cursor.execute("""
        INSERT INTO users (email, password_hash, full_name, student_id, program, semester, institution_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            "demo@student.edu",
            hashed,
            "Demo Student",
            "STU-2026-0842",
            "Computer Science",
            4,
            3
        ))
        conn.commit()
    else:
        cursor.execute("UPDATE users SET full_name = 'Demo Student' WHERE email = 'demo@student.edu'")
        conn.commit()

    conn.commit()
    conn.close()
