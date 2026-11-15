import joblib
import pandas as pd
import numpy as np
from typing import List, Tuple, Dict, Any
from backend.app.core.config import (
    SCORE_MODEL_PATH, RISK_MODEL_PATH,
    RISK_THRESHOLD_SAFE, RISK_THRESHOLD_WARNING
)
from backend.app.schemas.student import StudentInput, PredictionResult, SimulationResponse
import backend.ml  # Ensures module alias registration for joblib unpickling

class PredictorService:
    def __init__(self):
        self._score_model = None
        self._risk_model = None

    def _load_models(self):
        if self._score_model is None:
            if not SCORE_MODEL_PATH.exists():
                raise FileNotFoundError(f"Score model not found at {SCORE_MODEL_PATH}. Run training first.")
            self._score_model = joblib.load(SCORE_MODEL_PATH)

        if self._risk_model is None:
            if not RISK_MODEL_PATH.exists():
                raise FileNotFoundError(f"Risk model not found at {RISK_MODEL_PATH}. Run training first.")
            self._risk_model = joblib.load(RISK_MODEL_PATH)

    def _student_to_df(self, student: StudentInput) -> pd.DataFrame:
        data = student.model_dump()
        return pd.DataFrame([data])

    def _determine_grade(self, score: float) -> str:
        if score >= 90:
            return "A+ (Outstanding)"
        elif score >= 80:
            return "A (Excellent)"
        elif score >= 70:
            return "B (Good)"
        elif score >= 60:
            return "C (Satisfactory)"
        elif score >= 50:
            return "D (Pass - Borderline)"
        else:
            return "F (Failing / At Risk)"

    def _analyze_factors(self, student: StudentInput, score: float, risk_prob: float) -> Tuple[List[str], List[str], List[str]]:
        strengths = []
        risks = []
        recommendations = []

        # Attendance
        if student.attendance_pct >= 85:
            strengths.append(f"Strong attendance rate ({student.attendance_pct:.1f}%), indicating high engagement.")
        elif student.attendance_pct < 75:
            risks.append(f"Low attendance ({student.attendance_pct:.1f}%), falling below the standard 75% threshold.")
            recommendations.append("Prioritize attending core lectures and practicals to regain conceptual continuity.")

        # Study hours
        if student.study_hours_per_day >= 4.0:
            strengths.append(f"Dedicated daily study routine ({student.study_hours_per_day:.1f} hrs/day).")
        elif student.study_hours_per_day < 2.5:
            risks.append(f"Insufficient daily study time ({student.study_hours_per_day:.1f} hrs/day).")
            recommendations.append("Increase structured daily revision by at least 1.5 hours to solidify coursework.")

        # Internal marks & assignments
        if student.internal_marks >= 75:
            strengths.append(f"High internal assessment score ({student.internal_marks:.1f}/100).")
        elif student.internal_marks < 60:
            risks.append(f"Vulnerable internal assessment score ({student.internal_marks:.1f}/100).")
            recommendations.append("Seek remedial tutoring or faculty mentoring on upcoming mid-term assessments.")

        if student.assignment_completion_pct < 70:
            risks.append(f"Low assignment completion ({student.assignment_completion_pct:.1f}%).")
            recommendations.append("Complete outstanding coursework assignments to recover continuous assessment marks.")

        # Deadlines
        if student.missed_deadlines == 0:
            strengths.append("Perfect submission discipline (0 missed deadlines).")
        elif student.missed_deadlines >= 2:
            risks.append(f"Accumulated {student.missed_deadlines} missed submission deadlines.")
            recommendations.append("Adopt a digital task planner and submit milestone drafts 48 hours prior to due dates.")

        # LMS engagement
        if student.lms_logins < 10:
            risks.append(f"Critically low LMS portal activity ({student.lms_logins} logins).")
            recommendations.append("Access course LMS materials and review lecture slides regularly each week.")
        elif student.lms_logins >= 25:
            strengths.append(f"Active digital learning engagement ({student.lms_logins} LMS logins).")

        # Sleep & commute
        if student.sleep_hours < 6.0:
            risks.append(f"Suboptimal sleep duration ({student.sleep_hours:.1f} hrs/night).")
            recommendations.append("Target 7–8 hours of consistent sleep to improve memory retention and focus.")
        if student.commute_minutes > 60:
            recommendations.append("Utilize daily commute time for recorded lecture audio or mobile flashcards.")

        if not recommendations:
            recommendations.append("Maintain the current disciplined study habits and consistent attendance.")

        return strengths, risks, recommendations

    def predict(self, student: StudentInput) -> PredictionResult:
        self._load_models()
        df = self._student_to_df(student)

        # Regression prediction
        raw_score = float(self._score_model.predict(df)[0])
        score = float(np.clip(raw_score, 0.0, 100.0))

        # Classification probability
        risk_prob = float(self._risk_model.predict_proba(df)[0, 1])

        # Hybrid early-warning calculation: 70% classifier + 30% score inverse
        hybrid_risk = float(0.70 * risk_prob + 0.30 * (1.0 - score / 100.0))
        hybrid_risk = float(np.clip(hybrid_risk, 0.0, 1.0))

        # Determine risk classification status
        if hybrid_risk < RISK_THRESHOLD_SAFE:
            status = "SAFE"
            color = "#10b981"  # Emerald green
        elif hybrid_risk < RISK_THRESHOLD_WARNING:
            status = "MODERATE WARNING"
            color = "#f59e0b"  # Amber
        else:
            status = "CRITICAL AT RISK"
            color = "#ef4444"  # Rose Red

        grade = self._determine_grade(score)
        strengths, risks, recs = self._analyze_factors(student, score, risk_prob)

        return PredictionResult(
            predicted_score=round(score, 2),
            score_grade=grade,
            at_risk_probability=round(risk_prob, 4),
            hybrid_risk_index=round(hybrid_risk, 4),
            risk_status=status,
            risk_color=color,
            recommendations=recs,
            key_strengths=strengths,
            risk_factors=risks
        )

    def simulate(self, base_student: StudentInput, changes: Dict[str, float]) -> SimulationResponse:
        original_res = self.predict(base_student)

        # Clone and apply changes
        sim_data = base_student.model_dump()
        for k, v in changes.items():
            if k in sim_data:
                sim_data[k] = v

        sim_student = StudentInput(**sim_data)
        sim_res = self.predict(sim_student)

        score_diff = round(sim_res.predicted_score - original_res.predicted_score, 2)
        risk_diff = round(sim_res.hybrid_risk_index - original_res.hybrid_risk_index, 4)

        if score_diff > 0:
            feedback = f"Simulation shows a positive improvement of +{score_diff} points and a {(abs(risk_diff)*100):.1f}% reduction in academic risk!"
        elif score_diff < 0:
            feedback = f"Simulation projects a decline of {score_diff} points. Increasing academic intervention is recommended."
        else:
            feedback = "Simulated parameters resulted in no significant score divergence."

        return SimulationResponse(
            original_score=original_res.predicted_score,
            simulated_score=sim_res.predicted_score,
            score_diff=score_diff,
            original_risk=original_res.hybrid_risk_index,
            simulated_risk=sim_res.hybrid_risk_index,
            risk_diff=risk_diff,
            original_status=original_res.risk_status,
            simulated_status=sim_res.risk_status,
            feedback=feedback
        )

# Global service singleton
predictor_service = PredictorService()
