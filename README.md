# 🎓 Student Success Prediction & Early-Warning Advisory System

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python Version" />
  <img src="https://img.shields.io/badge/FastAPI-0.110.0-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/scikit--learn-1.3+-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white" alt="scikit-learn" />
  <img src="https://img.shields.io/badge/Pydantic-v2.6-E92063?style=for-the-badge&logo=pydantic&logoColor=white" alt="Pydantic" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

An end-to-end Machine Learning and full-stack software application that predicts university students' final academic performance and provides proactive early-warning detection for students academically at risk.

Built on a synthetic **200,000-student cohort** featuring multi-campus distribution shifts, the project demonstrates the full Data Science and ML lifecycle: **synthetic data synthesis, automated EDA, leakage-safe feature engineering, baseline vs. non-linear benchmarking, hyperparameter tuning (`RandomizedSearchCV`), multi-model fusion (Voting & Stacking ensembles), domain generalization across unseen institutions, a high-performance FastAPI service, and a modern reactive dashboard**.

---

## 📌 Table of Contents

- [Key Highlights & Capabilities](#-key-highlights--capabilities)
- [System Architecture](#-system-architecture)
- [Dataset & Input Features](#-dataset--input-features)
- [Machine Learning Engineering](#-machine-learning-engineering)
  - [Model Benchmarks & Performance](#model-benchmarks--performance)
  - [Hybrid Early-Warning Scoring](#hybrid-early-warning-scoring)
  - [Domain Generalization Experiment](#domain-generalization-experiment)
- [Project Directory Structure](#-project-directory-structure)
- [Installation & Setup Guide](#-installation--setup-guide)
  - [Prerequisites](#prerequisites)
  - [Option A: Quick Start (FastAPI + Pre-Compiled React UI)](#option-a-quick-start-fastapi--pre-compiled-react-ui-recommended)
  - [Option B: Full-Stack Developer Mode (Vite Dev + FastAPI)](#option-b-full-stack-developer-mode-vite-dev--fastapi)
  - [Option C: Streamlit Interactive EDA Mode](#option-c-streamlit-interactive-eda-mode)
  - [Re-training the ML Pipeline from Scratch](#re-training-the-ml-pipeline-from-scratch)
- [API Reference & Swagger Documentation](#-api-reference--swagger-documentation)
- [Automated Testing](#-automated-testing)
- [Ethical AI & Prototype Notice](#-ethical-ai--prototype-notice)
- [License & Acknowledgments](#-license--acknowledgments)

---

## 🚀 Key Highlights & Capabilities

### 1. 🎯 Real-Time Student Predictor
- Input granular student metrics (attendance, study hours, previous GPA, internal marks, sleep, commute, LMS activity, etc.).
- Instantly estimates continuous **Final Score (0–100)** and calculates **At-Risk Probability**.
- Outputs tailored, rule-informed **Key Strengths**, **Risk Factors**, and prioritized **Actionable Interventions** for faculty advisors.
- Includes pre-configured archetype presets (*High Performer*, *Balanced Average*, *Borderline At-Risk*, *Critical Academic Warning*).

### 2. 🔬 What-If Scenario Simulator
- Dynamic slider interface allowing advisors or students to simulate behavioral interventions.
- Real-time delta calculations showing how increasing attendance by $+15\%$ or study hours by $+2\text{ hrs/day}$ shifts the predicted score and lowers risk probability.

### 3. 📊 Benchmark Leaderboards
- Transparent model comparison tables for both **Regression** (9 models) and **Classification** (7 models).
- Interactive tabs for reviewing MAE, RMSE, $R^2$, Accuracy, Precision, Recall, F1-Score, and ROC-AUC.

### 4. 🌐 Domain Generalization Stress-Testing
- Evaluates model performance on institutions withheld entirely from model training (Campuses 8 & 9).
- Quantifies transferability and robustness against cross-institutional distribution shifts.

### 5. 📁 High-Throughput Batch Inference
- Upload student cohorts via CSV or paste JSON batches to evaluate entire classrooms or departments simultaneously.
- Real-time aggregate statistics (Cohort Mean Score, Safe vs. At-Risk counts) with exportable results.

### 6. 📈 Exploratory Analytics & Visualizations
- In-depth dataset profiling, missing value distributions, correlation matrices, and academic indicator distributions directly in the dashboard.

---

## 🏛 System Architecture

```text
 ┌────────────────────────────────────────────────────────────────────────┐
 │                         React 18 Single-Page UI                        │
 │  (Predictor • What-If Simulator • Leaderboard • Domain Gen • Batch)    │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP / REST APIs
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │                          FastAPI Backend Core                          │
 │      (/api/predict • /api/batch-predict • /api/simulate • /health)     │
 └─────────────┬────────────────────────────────────────────┬─────────────┘
               │                                            │
               ▼                                            ▼
 ┌───────────────────────────┐                ┌───────────────────────────┐
 │   Trained Model Artifacts │                │   Reports & Leaderboards  │
 │  - best_score_model.joblib│                │  - model comparisons      │
 │  - best_risk_model.joblib │                │  - domain generalization  │
 └─────────────▲─────────────┘                │  - training summaries     │
               │                              └───────────────────────────┘
 ┌─────────────┴──────────────────────────────────────────────────────────┐
 │                         Machine Learning Pipeline                      │
 │                                                                        │
 │  Synthetic Data Gen (200k) ──> Feature Engineering ──> Preprocessing   │
 │                                                              │         │
 │          ┌───────────────────────────────────────────────────┘         │
 │          ▼                                                             │
 │   Regression Models               Classification Models                │
 │   - Linear / Ridge                - Logistic Regression                │
 │   - Decision Tree                 - Decision Tree                      │
 │   - Random Forest                 - Random Forest                      │
 │   - Extra Trees                   - Extra Trees                        │
 │   - HistGradientBoosting          - HistGradientBoosting               │
 │   - Tuned Random Forest           - Soft Voting Ensemble               │
 │   - Stacking / Voting Fusion      - Stacking Ensemble                  │
 └────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Dataset & Input Features

The pipeline processes synthetic academic, behavioral, contextual, and demographic indicators:

| Category | Features | Description |
|---|---|---|
| **Academic** | `previous_gpa`, `internal_marks`, `assignment_completion_pct`, `semester`, `program` | Historical and current term grades, coursework submission rates, and enrolled curriculum. |
| **Behavioral** | `study_hours_per_day`, `attendance_pct`, `lms_logins`, `missed_deadlines` | Direct effort signals: daily self-study, lecture presence, portal engagement, and submission timeliness. |
| **Well-Being & Context** | `sleep_hours`, `commute_minutes`, `internet_access`, `part_time_job` | Extracurricular constraints, physical travel burden, sleep schedule, and digital connectivity. |
| **Demographics** | `age`, `parental_education`, `financial_pressure`, `extracurricular_level`, `institution_id` | Cohort background factors with multi-institution campus distribution variations. |

---

## 🔬 Machine Learning Engineering

### Leakage-Safe Feature Engineering
Engineered indicators capture domain-specific student dynamics:
- **Study × Attendance Interaction**: `study_hours_per_day * attendance_pct`
- **Assessment Performance Mean**: Average between internal marks and assignment completion.
- **Normalized Deadline Strain**: Missed deadlines relative to semester progression.
- **LMS Efficiency**: Digital activity ratio per daily study hour.
- **Commute & Sleep Deviation Burden**: Non-linear penalty features reflecting student exhaustion risk.

### Model Benchmarks & Performance

#### Regression: Predicting Final Score (0–100)
Evaluated on a held-out test split of 40,000 synthetic records:

| Model | MAE | RMSE | $R^2$ |
|---|---|---|---|
| **Linear Regression (Baseline)** | **5.917** | **7.401** | **0.6408** |
| **Ridge Regression** | 5.917 | 7.401 | 0.6408 |
| **Stacking Fusion (Meta-Learner)** | 5.937 | 7.440 | 0.6370 |
| **HistGradientBoosting** | 5.945 | 7.446 | 0.6363 |
| **Voting Regressor** | 6.000 | 7.504 | 0.6307 |
| **Extra Trees** | 6.069 | 7.591 | 0.6220 |
| **Tuned Random Forest** | 6.127 | 7.666 | 0.6145 |
| **Random Forest** | 6.159 | 7.708 | 0.6104 |
| **Decision Tree** | 6.839 | 8.582 | 0.5169 |

#### Classification: Predicting At-Risk Status (`score < 60`)
Evaluated across balanced precision-recall metrics:

| Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
|---|---|---|---|---|---|
| **Extra Trees** | 88.37% | 0.4230 | 0.6542 | **0.5138** | 0.9057 |
| **Random Forest** | 90.69% | 0.5047 | 0.4828 | 0.4935 | 0.9025 |
| **Logistic Regression (Baseline)** | 82.20% | 0.3282 | **0.8542** | 0.4742 | **0.9181** |
| **Stacking Fusion** | 92.11% | 0.6465 | 0.3528 | 0.4565 | 0.9120 |
| **HistGradientBoosting** | **92.16%** | 0.6573 | 0.3469 | 0.4541 | 0.9132 |
| **Decision Tree** | 77.82% | 0.2647 | 0.7651 | 0.3933 | 0.8194 |
| **Soft Voting Fusion** | 91.88% | **0.7255** | 0.2187 | 0.3361 | 0.9117 |

### Hybrid Early-Warning Scoring
Rather than relying solely on hard classification cutoffs, the inference engine combines the classifier probability with an inverse regression score:
$$\text{Hybrid Risk Index} = 0.70 \times P(\text{At-Risk}) + 0.30 \times \left(1 - \frac{\text{Predicted Score}}{100}\right)$$
- **Index $< 0.35$**: 🟢 **SAFE**
- **Index $0.35$ – $0.50$**: 🟡 **MODERATE WARNING**
- **Index $\ge 0.50$**: 🔴 **CRITICAL AT RISK**

### Domain Generalization Experiment
To test model robustness across institutions with differing baseline characteristics, **Institutions 8 and 9** were completely withheld during training:

| Model | Test Domain | MAE | RMSE | $R^2$ | Train Rows | Held-out Test Rows |
|---|---|---|---|---|---|---|
| **HistGradientBoosting** | Unseen Institutions (8 & 9) | **6.305** | **7.853** | **0.5442** | 160,084 | 39,916 |
| **Random Forest** | Unseen Institutions (8 & 9) | 6.500 | 8.082 | 0.5173 | 160,084 | 39,916 |

---

## 📂 Project Directory Structure

```text
Himi_Project/
├── README.md                   # Primary project documentation & guide
├── backend/
│   ├── app/
│   │   ├── api/                # API router endpoints
│   │   │   ├── routes_predict.py      # /api/predict, /api/batch-predict, /api/simulate
│   │   │   ├── routes_models.py       # /api/models/leaderboard, domain gen
│   │   │   └── routes_analytics.py    # /api/analytics summaries & figures
│   │   ├── core/
│   │   │   └── config.py              # Environment & application constants
│   │   ├── schemas/            # Pydantic v2 data models
│   │   │   ├── student.py             # Student inputs, predictions, simulation schemas
│   │   │   └── reports.py             # Leaderboard & report schemas
│   │   ├── services/           # Business logic & ML inference
│   │   │   ├── predictor.py           # Model loading, prediction, advisory generation
│   │   │   └── analytics.py           # EDA report parsing & summaries
│   │   └── main.py             # FastAPI factory & SPA static server
│   ├── artifacts/              # Serialized ML models (.joblib)
│   ├── data/                   # Synthetic data directories
│   │   └── raw/                # Raw synthetic student records
│   ├── ml/                     # ML training & evaluation modules
│   │   ├── generate_data.py    # 200k synthetic dataset synthesis
│   │   ├── eda.py              # Exploratory data analysis & figure generator
│   │   ├── features.py         # Leakage-safe feature transformer
│   │   ├── train.py            # Training, tuning & ensemble stacking
│   │   ├── domain_generalization.py # Cross-campus transfer experiment
│   │   └── predict.py          # Standalone CLI inference script
│   ├── reports/                # Generated metrics CSVs & EDA charts
│   ├── tests/                  # Unit and integration test suite
│   ├── app_streamlit.py        # Alternative Streamlit dashboard
│   ├── requirements.txt        # Python backend dependencies
│   └── run.py                  # Backend server launcher
└── frontend/
    ├── src/
    │   ├── components/         # React components
    │   │   ├── Header.jsx             # Top bar navigation & health status
    │   │   ├── PredictorTab.jsx       # Single-student prediction form & cards
    │   │   ├── SimulatorTab.jsx       # Interactive what-if scenario sliders
    │   │   ├── LeaderboardTab.jsx     # Regression & classification comparison tables
    │   │   ├── DomainGenTab.jsx       # Held-out campus generalization metrics
    │   │   ├── AnalyticsTab.jsx       # Exploratory analysis & charts
    │   │   └── BatchPredictTab.jsx    # CSV / JSON batch prediction table
    │   ├── services/
    │   │   └── api.js                 # Axios/Fetch API client
    │   ├── App.jsx             # Main dashboard layout
    │   └── index.css           # Premium cyber-academic styling
    ├── dist/                   # Production-compiled React SPA assets
    ├── package.json            # Node.js dependencies & scripts
    └── vite.config.js          # Vite bundler & reverse proxy configuration
```

---

## 🛠 Installation & Setup Guide

### Prerequisites
- **Python**: Version `3.10`, `3.11`, or `3.12` installed.
- **Git**: Installed and configured.
- *(Optional)* **Node.js**: Version `18+` (Only required if you wish to modify and rebuild the React frontend).

---

### Option A: Quick Start (FastAPI + Pre-Compiled React UI) [Recommended]

The repository comes with the React frontend already pre-built in `frontend/dist/`. FastAPI serves the complete dashboard and API in a single process.

#### 1. Clone the Repository
```powershell
git clone https://github.com/amanydv1106/Student-Analytics.git
cd Student-Analytics
```

#### 2. Create and Activate a Python Virtual Environment
```powershell
# Windows (PowerShell)
python -m venv backend\.venv
.\backend\.venv\Scripts\Activate.ps1

# Linux / macOS
python3 -m venv backend/.venv
source backend/.venv/bin/activate
```

#### 3. Install Backend Dependencies
```powershell
python -m pip install --upgrade pip
pip install -r backend/requirements.txt
```

#### 4. Launch the Application Server
```powershell
python -m backend.run
```

#### 5. Open in Your Browser
- 🖥️ **Full Web Dashboard**: [http://localhost:8000](http://localhost:8000)
- 📚 **Interactive Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- 🩺 **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

### Option B: Full-Stack Developer Mode (Vite Dev + FastAPI)

If you are modifying React components or styling, run the Vite development server with Hot Module Replacement (HMR).

#### Terminal 1 — Start Backend Server:
```powershell
.\backend\.venv\Scripts\Activate.ps1
python -m backend.run
```
*(Runs FastAPI at `http://localhost:8000`)*

#### Terminal 2 — Start Vite Dev Server:
```powershell
cd frontend
npm install
npm run dev
```
*(Runs Vite at `http://localhost:5173` with reverse proxying of `/api` and `/health` requests to port 8000)*

#### To compile new frontend changes for production:
```powershell
cd frontend
npm run build
```

---

### Option C: Streamlit Interactive EDA Mode

If you prefer exploring the raw dataset, correlation graphs, and model metrics inside a Streamlit dashboard:

```powershell
.\backend\.venv\Scripts\Activate.ps1
streamlit run backend/app_streamlit.py
```

---

### Re-training the ML Pipeline from Scratch

To generate a new synthetic cohort, run EDA, train all models with hyperparameter tuning, and evaluate domain transfer:

```powershell
.\backend\.venv\Scripts\Activate.ps1

# 1. Synthesize student records (e.g., 20,000 for quick run or 200,000 for full scale)
python -m backend.ml.generate_data --rows 20000

# 2. Run Exploratory Data Analysis & generate reports
python -m backend.ml.eda

# 3. Train all baseline and ensemble models (saves best models to backend/artifacts/)
python -m backend.ml.train

# 4. Run held-out campus domain generalization test
python -m backend.ml.domain_generalization

# 5. Test CLI inference on sample student
python -m backend.ml.predict
```

---

## 📡 API Reference & Swagger Documentation

FastAPI automatically serves interactive OpenAPI documentation at `/docs` (Swagger UI) and `/redoc`.

### Key Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server status and frontend build verification. |
| `POST` | `/api/predict` | Predict individual student score, at-risk probability, and intervention tips. |
| `POST` | `/api/batch-predict` | High-throughput batch inference for multiple student records. |
| `POST` | `/api/simulate` | Evaluates what-if modifications against a base student profile. |
| `GET` | `/api/sample-students` | Returns archetypal student profiles for testing. |
| `GET` | `/api/models/leaderboard` | Full comparison metrics for all regression and classification models. |
| `GET` | `/api/models/domain-generalization` | Unseen campus transferability evaluation. |
| `GET` | `/api/analytics/summary` | Profile summary of dataset distributions and missing values. |
| `GET` | `/api/analytics/figures/{filename}` | Retrieve generated EDA plots and correlation matrices. |

### Sample Request (`POST /api/predict`)
```json
{
  "institution_id": 3,
  "program": "Computer Science",
  "semester": 4,
  "age": 21,
  "study_hours_per_day": 4.5,
  "attendance_pct": 82.0,
  "previous_gpa": 7.5,
  "assignment_completion_pct": 88.0,
  "internal_marks": 76.0,
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
```

### Sample Response
```json
{
  "predicted_score": 75.34,
  "score_grade": "A",
  "at_risk_probability": 0.042,
  "hybrid_risk_index": 0.103,
  "risk_status": "SAFE",
  "risk_color": "#10b981",
  "recommendations": [
    "Maintain consistent daily study routines.",
    "Target active participation in internal assessments."
  ],
  "key_strengths": [
    "High lecture attendance (82.0%)",
    "Consistent coursework completion (88.0%)"
  ],
  "risk_factors": []
}
```

---

## 🧪 Automated Testing

Unit and integration tests verify the reliability of the feature engineering pipeline, prediction engine, and API routes.

```powershell
.\backend\.venv\Scripts\Activate.ps1
pytest backend/tests -v
```

---

## ⚖️ Ethical AI & Prototype Notice

> **Academic Prototype Disclosure:**
> - All 200,000 records processed by this repository are **synthetically generated** using parametric statistical formulas and controlled distribution noise.
> - The dataset does **not** contain real student personally identifiable information (PII) and must not be presented as institutional administrative data.
> - This software is engineered as an **academic demonstration** and decision-support prototype. It is **not** intended to make autonomous or consequential decisions regarding student grading, admissions, retention, or punitive actions without human advisor oversight.

---

## 📄 License & Acknowledgments

- **License**: MIT License. See [LICENSE](LICENSE) for details.
- **Developed for**: MCA Final-Year Project.
- **Author**: [Aman Yadav](https://github.com/amanydv1106)

---
<p align="center">
  Made with ❤️ for educational data science and student success.
</p>
