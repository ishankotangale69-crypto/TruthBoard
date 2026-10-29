"""
TruthBoard Server Launcher
Usage: python run_server.py
Starts Uvicorn ASGI server with hot reloading enabled.
"""

import sys
import uvicorn
from app.config import settings

if __name__ == "__main__":
    print(f"Starting TruthBoard API server at http://{settings.HOST}:{settings.PORT}")
    print(f"Swagger API Docs: http://127.0.0.1:{settings.PORT}/docs")
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
        log_level="info"
    )
