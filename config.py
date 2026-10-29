"""
TruthBoard Configuration & Environment Settings
"""

import os
from typing import List

class Settings:
    PROJECT_NAME: str = "TruthBoard"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DESCRIPTION: str = "Real-time AI Hallucination Interceptor API designed to plug into LLM response pipelines."
    
    # Latency & scoring thresholds
    SAFE_THRESHOLD: int = int(os.getenv("TB_SAFE_THRESHOLD", "80"))
    WARNING_THRESHOLD: int = int(os.getenv("TB_WARNING_THRESHOLD", "50"))
    LATENCY_CEILING_MS: float = float(os.getenv("TB_LATENCY_CEILING_MS", "15.0"))
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "null",  # Allows local file:// browser access
        "*"      # Development wildcard
    ]
    
    HOST: str = os.getenv("TB_HOST", "0.0.0.0")
    PORT: int = int(os.getenv("TB_PORT", "8000"))

settings = Settings()
