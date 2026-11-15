"""Service logic for Student Portal: report synthesis, strength analysis, and preparation recommendations."""
import json
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from backend.app.schemas.student import StudentInput
from backend.app.schemas.student_report import (
    StudentReportInput, StudentPerformanceReport, ComponentMetric, ReportHistoryItem
)
from backend.app.services.predictor import predictor_service
from backend.app.core.database import get_connection

class StudentPortalService:
    def generate_student_report(
        self,
        user: Dict[str, Any],
        report_input: StudentReportInput
    ) -> StudentPerformanceReport:
        """Process student marks and indicators through ML models and generate tailored diagnostic summary."""
        # 1. Assemble ML StudentInput using student profile context + entered marks
        student_ml_input = StudentInput(
            institution_id=user.get("institution_id", 3),
            program=user.get("program", "Computer Science"),
            semester=user.get("semester", 4),
            age=22,
            study_hours_per_day=report_input.study_hours_per_day,
            attendance_pct=report_input.attendance_pct,
            previous_gpa=report_input.previous_gpa,
            assignment_completion_pct=report_input.assignment_completion_pct,
            internal_marks=report_input.internal_marks,
            sleep_hours=report_input.sleep_hours,
            commute_minutes=report_input.commute_minutes,
            internet_access=report_input.internet_access,
            parental_education="Undergraduate",
            extracurricular_level=report_input.extracurricular_level,
            financial_pressure=report_input.financial_pressure,
            part_time_job=report_input.part_time_job,
            lms_logins=report_input.lms_logins,
            missed_deadlines=report_input.missed_deadlines
        )

        # 2. Run ML inference
        pred_res = predictor_service.predict(student_ml_input)

        # 3. Analyze "In Which He Is Best" (Key Strengths)
        best_strengths: List[str] = []
        if report_input.internal_marks >= 75:
            best_strengths.append(f"🌟 Continuous Assessment: High internal score of {report_input.internal_marks:.1f}/100 demonstrates strong grasp of core theoretical concepts.")
        if report_input.attendance_pct >= 85:
            best_strengths.append(f"🌟 Lecture Attendance: Superb attendance at {report_input.attendance_pct:.1f}% ensures you never miss classroom problem-solving sessions.")
        if report_input.assignment_completion_pct >= 85:
            best_strengths.append(f"🌟 Practical Coursework: Outstanding assignment delivery ({report_input.assignment_completion_pct:.1f}%), maximizing lab assessment marks.")
        if report_input.study_hours_per_day >= 4.0:
            best_strengths.append(f"🌟 Self-Study Discipline: Consistent revision routine of {report_input.study_hours_per_day:.1f} hours daily builds deep subject mastery.")
        if report_input.missed_deadlines == 0:
            best_strengths.append("🌟 Academic Punctuality: Zero missed deadlines this term demonstrates top-tier time management and submission discipline.")
        if report_input.lms_logins >= 20:
            best_strengths.append(f"🌟 Digital Learning: Highly proactive LMS portal engagement ({report_input.lms_logins} logins) keeps you updated on syllabus materials.")
        if report_input.previous_gpa >= 8.0:
            best_strengths.append(f"🌟 Strong Academic Foundation: High cumulative GPA of {report_input.previous_gpa:.2f}/10 provides solid prerequisite competency.")

        if not best_strengths:
            best_strengths.append("🌟 Foundation: You maintain baseline participation across college courses with opportunity for substantial acceleration.")

        # 4. Analyze "What He Needs To Prepare" (Targeted Improvement Priorities)
        preparation_priorities: List[str] = []
        if report_input.internal_marks < 60:
            preparation_priorities.append(f"🎯 Target Internal Exams: Your internal mark is {report_input.internal_marks:.1f}/100. Review prior test papers, attend tutorial doubts, and schedule faculty review hours.")
        elif report_input.internal_marks < 75:
            preparation_priorities.append(f"🎯 Elevate Mid-Term Score: Internal score at {report_input.internal_marks:.1f}/100. Target +10 points on the next assessment to lock in an 'A' grade range.")

        if report_input.attendance_pct < 75:
            preparation_priorities.append(f"🎯 Critical Attendance Recovery: Currently at {report_input.attendance_pct:.1f}%, which is below the mandatory 75% university bar. Prioritize daily class presence immediately.")
        elif report_input.attendance_pct < 82:
            preparation_priorities.append(f"🎯 Attend Key Problem Sessions: Boost attendance from {report_input.attendance_pct:.1f}% to 85%+ to secure full attendance continuous grading points.")

        if report_input.study_hours_per_day < 3.0:
            preparation_priorities.append(f"🎯 Increase Revision Routine: Dedicating only {report_input.study_hours_per_day:.1f} hrs/day. Allocate at least 1.5 additional hours every evening for structured problem sets.")

        if report_input.assignment_completion_pct < 75:
            preparation_priorities.append(f"🎯 Coursework Backlog: Assignment completion is at {report_input.assignment_completion_pct:.1f}%. Complete outstanding assignments to prevent continuous assessment deductions.")

        if report_input.missed_deadlines >= 2:
            preparation_priorities.append(f"🎯 Resolve Submission Delays: You have {report_input.missed_deadlines} missed deadlines. Use a digital calendar and start assignments at least 48 hours before cutoff.")

        if report_input.lms_logins < 12:
            preparation_priorities.append(f"🎯 LMS Resource Utilization: Only {report_input.lms_logins} portal logins this month. Check weekly lecture slides, lab manuals, and supplementary reading files.")

        if not preparation_priorities:
            preparation_priorities.append("🎯 Competitive Excellence: Keep testing with mock exams, previous year question banks, and explore advanced honors electives.")

        # 5. Formulate Components Breakdown
        components = [
            ComponentMetric(
                name="Internal Assessment",
                score=report_input.internal_marks,
                grade_label="A" if report_input.internal_marks >= 75 else ("B" if report_input.internal_marks >= 60 else "C"),
                status="Excellent" if report_input.internal_marks >= 75 else ("Satisfactory" if report_input.internal_marks >= 60 else "Attention Needed"),
                color="#10b981" if report_input.internal_marks >= 75 else ("#f59e0b" if report_input.internal_marks >= 60 else "#ef4444"),
                feedback="High conceptual grasp" if report_input.internal_marks >= 75 else "Needs focused revision on difficult units"
            ),
            ComponentMetric(
                name="Classroom Attendance",
                score=report_input.attendance_pct,
                grade_label="A" if report_input.attendance_pct >= 85 else ("B" if report_input.attendance_pct >= 75 else "Warning"),
                status="Consistent" if report_input.attendance_pct >= 80 else ("Borderline" if report_input.attendance_pct >= 75 else "Critical"),
                color="#10b981" if report_input.attendance_pct >= 80 else ("#f59e0b" if report_input.attendance_pct >= 75 else "#ef4444"),
                feedback="Eligible & high engagement" if report_input.attendance_pct >= 75 else "Below 75% institutional threshold"
            ),
            ComponentMetric(
                name="Assignments & Practicals",
                score=report_input.assignment_completion_pct,
                grade_label="A" if report_input.assignment_completion_pct >= 80 else ("B" if report_input.assignment_completion_pct >= 65 else "C"),
                status="Strong" if report_input.assignment_completion_pct >= 80 else ("Fair" if report_input.assignment_completion_pct >= 65 else "Backlog"),
                color="#10b981" if report_input.assignment_completion_pct >= 80 else ("#f59e0b" if report_input.assignment_completion_pct >= 65 else "#ef4444"),
                feedback="All lab reports up to date" if report_input.assignment_completion_pct >= 80 else "Submit outstanding homework"
            ),
            ComponentMetric(
                name="Study Habit Dedication",
                score=min(100.0, (report_input.study_hours_per_day / 6.0) * 100.0),
                grade_label=f"{report_input.study_hours_per_day:.1f}h/day",
                status="Optimal" if report_input.study_hours_per_day >= 4.0 else ("Moderate" if report_input.study_hours_per_day >= 2.5 else "Low"),
                color="#10b981" if report_input.study_hours_per_day >= 4.0 else ("#f59e0b" if report_input.study_hours_per_day >= 2.5 else "#ef4444"),
                feedback="Good revision cadence" if report_input.study_hours_per_day >= 3.5 else "Increase study blocks by 1-2 hours"
            ),
            ComponentMetric(
                name="Submission Discipline",
                score=max(0.0, 100.0 - (report_input.missed_deadlines * 20.0)),
                grade_label=f"{report_input.missed_deadlines} Missed",
                status="Disciplined" if report_input.missed_deadlines == 0 else ("Minor Delay" if report_input.missed_deadlines <= 2 else "Frequent Delay"),
                color="#10b981" if report_input.missed_deadlines == 0 else ("#f59e0b" if report_input.missed_deadlines <= 2 else "#ef4444"),
                feedback="Strict adherence to schedule" if report_input.missed_deadlines == 0 else "Set up advance submission reminders"
            )
        ]

        # 6. Synthesize Executive Narrative Summary
        name = user.get("full_name", "Student")
        prog = user.get("program", "Degree Program")
        sem = user.get("semester", 4)
        score = pred_res.predicted_score
        grade = pred_res.score_grade
        status = pred_res.risk_status

        if status == "SAFE":
            summary = (
                f"Academic diagnostics for {name} ({prog}, Semester {sem}) indicate an exemplary academic trajectory. "
                f"With a projected final examination score of {score:.1f}/100 ({grade}), the student operates firmly in the SAFE zone. "
                f"Key drivers include consistent class engagement ({report_input.attendance_pct:.0f}%) and solid assessment deliverables ({report_input.internal_marks:.0f}/100). "
                f"Continuing this disciplined routine will solidify peak semester honors."
            )
        elif status == "MODERATE WARNING":
            summary = (
                f"Academic diagnostics for {name} ({prog}, Semester {sem}) indicate a moderate early-warning signal. "
                f"The projected final examination score is {score:.1f}/100 ({grade}), placing the student in the MODERATE ADVISORY tier. "
                f"While foundational scores are viable, strategic attention is required to lift attendance or internal assessment marks. "
                f"Implementing the targeted preparation priorities below will reliably elevate the student back to the Safe honors bracket."
            )
        else:
            summary = (
                f"Academic diagnostics for {name} ({prog}, Semester {sem}) highlight an immediate CRITICAL EARLY-WARNING. "
                f"The current academic and behavioral parameters project a final score of {score:.1f}/100 ({grade}), indicating elevated risk of academic shortfall. "
                f"Immediate intervention is advised: coordinate with faculty advisors, recover pending assignment deadlines, and elevate lecture presence to satisfy institutional criteria."
            )

        now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

        # 7. Persist to database if user has valid id
        report_id = None
        user_id = user.get("id")
        if user_id:
            try:
                conn = get_connection()
                cur = conn.cursor()
                summary_data = {
                    "executive_summary": summary,
                    "best_strengths": best_strengths,
                    "preparation_priorities": preparation_priorities,
                    "component_breakdown": [c.model_dump() for c in components]
                }
                cur.execute("""
                INSERT INTO student_reports (
                    user_id, input_data, predicted_score, score_grade,
                    risk_status, at_risk_prob, hybrid_risk_index, summary_report
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    user_id,
                    json.dumps(report_input.model_dump()),
                    score,
                    grade,
                    status,
                    pred_res.at_risk_probability,
                    pred_res.hybrid_risk_index,
                    json.dumps(summary_data)
                ))
                report_id = cur.lastrowid
                conn.commit()
                conn.close()
            except Exception as e:
                print(f"Error persisting student report: {e}")

        return StudentPerformanceReport(
            report_id=report_id,
            student_name=name,
            student_id=user.get("student_id", ""),
            program=prog,
            semester=sem,
            predicted_score=score,
            score_grade=grade,
            at_risk_probability=pred_res.at_risk_probability,
            hybrid_risk_index=pred_res.hybrid_risk_index,
            risk_status=status,
            risk_color=pred_res.risk_color,
            executive_summary=summary,
            best_strengths=best_strengths,
            preparation_priorities=preparation_priorities,
            component_breakdown=components,
            created_at=now_iso
        )

    def get_student_history(self, user_id: int) -> List[ReportHistoryItem]:
        """Fetch past reports for a student ordered by newest first."""
        history: List[ReportHistoryItem] = []
        try:
            conn = get_connection()
            cur = conn.cursor()
            cur.execute("""
            SELECT id, predicted_score, score_grade, risk_status, created_at
            FROM student_reports
            WHERE user_id = ?
            ORDER BY id DESC
            LIMIT 20
            """, (user_id,))
            rows = cur.fetchall()
            for r in rows:
                status = str(r["risk_status"])
                color = "#10b981" if status == "SAFE" else ("#f59e0b" if status == "MODERATE WARNING" else "#ef4444")
                history.append(ReportHistoryItem(
                    id=r["id"],
                    predicted_score=float(r["predicted_score"]),
                    score_grade=str(r["score_grade"]),
                    risk_status=status,
                    risk_color=color,
                    created_at=str(r["created_at"])
                ))
            conn.close()
        except Exception as e:
            print(f"Error reading student report history: {e}")
        return history

student_portal_service = StudentPortalService()
