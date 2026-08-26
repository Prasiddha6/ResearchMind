from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api.documents import router as documents_router

settings = get_settings()

app = FastAPI(
    title="ResearchMind API",
    description="Production-oriented RAG research assistant API.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "researchmind-api",
        "version": "0.1.0",
    }


@app.get("/api/v1")
async def api_root():
    return {
        "name": "ResearchMind",
        "message": "Research assistant API",
    }

app.include_router(documents_router, prefix="/api/v1")
