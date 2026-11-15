from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class RegressionModelMetric(BaseModel):
    model: str
    MAE: float
    RMSE: float
    R2: float

class ClassificationModelMetric(BaseModel):
    model: str
    accuracy: float
    precision: float
    recall: float
    f1: float
    roc_auc: float

class DomainGeneralizationMetric(BaseModel):
    model: str
    evaluation: str
    MAE: float
    RMSE: float
    R2: float
    train_rows: int
    test_rows: int

class LeaderboardResponse(BaseModel):
    best_regression_model: str
    best_classification_model: str
    regression_models: List[RegressionModelMetric]
    classification_models: List[ClassificationModelMetric]
    domain_generalization: List[DomainGeneralizationMetric]
    training_summary: Dict[str, Any]

class DataProfileItem(BaseModel):
    feature: str
    count: Optional[float] = None
    mean: Optional[float] = None
    std: Optional[float] = None
    min: Optional[float] = None
    p25: Optional[float] = None
    p50: Optional[float] = None
    p75: Optional[float] = None
    max: Optional[float] = None

class AnalyticsSummaryResponse(BaseModel):
    dataset_records: int
    features_count: int
    at_risk_percentage: float
    average_score: float
    score_std: float
    data_profile: List[Dict[str, Any]]
    missing_rates: List[Dict[str, Any]]
