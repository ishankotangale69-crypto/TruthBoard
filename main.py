"""
TruthBoard // Real-Time AI Hallucination Interceptor API
Production-Ready FastAPI Backend
"""

import time
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.config import settings
from app.routes.verify import router as verify_router
from app.routes.metrics import router as metrics_router
from app.routes.presets import router as presets_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifecycle management for startup & graceful shutdown."""
    print("=" * 65)
    print("  [TRUTHBOARD] Real-Time AI Hallucination Interceptor Engine")
    print(f"  [STATUS] Online • Port {settings.PORT} • Latency Target <12ms")
    print("  [SHIELD] Armed across Healthcare, E-Commerce, Education, Enterprise")
    print("=" * 65)
    yield
    print("  [TRUTHBOARD] Interceptor Engine Shutting Down Gracefully.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# -----------------------------------------------------------------------------
# CORS Middleware Configuration
# Allows connection from local frontend servers (Vite: 5173, Next.js: 3000, 8080, file://)
# -----------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-TruthBoard-Latency", "X-TruthBoard-Status", "X-TruthBoard-Action"]
)


# -----------------------------------------------------------------------------
# Low-Latency Header & Request Timing Middleware
# -----------------------------------------------------------------------------
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time_ms = round((time.perf_counter() - start_time) * 1000.0, 2)
    response.headers["X-TruthBoard-Latency-Ms"] = str(process_time_ms)
    response.headers["X-TruthBoard-Engine"] = "FastAPI-Async-V1"
    return response


# -----------------------------------------------------------------------------
# Modular Error Handling & Validation
# -----------------------------------------------------------------------------
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Clean, structured handling for failed payload validations."""
    errors = []
    for err in exc.errors():
        field_loc = " -> ".join([str(loc) for loc in err.get("loc", []) if loc != "body"])
        errors.append({
            "field": field_loc or "payload",
            "message": err.get("msg", "Invalid field format"),
            "type": err.get("type", "validation_error")
        })

    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Failed",
            "message": "Input payload rejected by TruthBoard validation schema.",
            "details": errors,
            "status_code": 422
        }
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Uniform HTTP error formatting."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTP Error",
            "detail": exc.detail,
            "status_code": exc.status_code
        }
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Fail-safe error handler preserving API uptime."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "detail": str(exc),
            "status_code": 500
        }
    )


# -----------------------------------------------------------------------------
# Route Registration
# -----------------------------------------------------------------------------
app.include_router(verify_router, prefix=settings.API_V1_PREFIX)
app.include_router(metrics_router, prefix=settings.API_V1_PREFIX)
app.include_router(presets_router, prefix=settings.API_V1_PREFIX)


# -----------------------------------------------------------------------------
# Root Health & Discovery Endpoint
# -----------------------------------------------------------------------------
@app.get(
    "/",
    tags=["Root"],
    summary="Root Health & Discovery Gateway"
)
async def root():
    return {
        "service": "TruthBoard AI Hallucination Interceptor API",
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "endpoints": {
            "verify_response": "POST /api/v1/verify-response",
            "system_metrics": "GET /api/v1/system-metrics",
            "simulation_presets": "POST & GET /api/v1/simulation-presets",
            "documentation": "/docs",
            "redoc": "/redoc"
        }
    }


@app.get("/health", tags=["Root"])
async def health_check():
    return {"status": "HEALTHY", "service": "TruthBoard"}
