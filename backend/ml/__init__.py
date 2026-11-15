import sys
from backend.ml import features

# Backward compatibility alias for joblib pipelines trained with 'src.features'
if "src" not in sys.modules:
    import types
    src_mod = types.ModuleType("src")
    src_mod.features = features
    sys.modules["src"] = src_mod
    sys.modules["src.features"] = features
