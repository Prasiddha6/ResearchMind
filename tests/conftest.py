import os

os.environ.setdefault(
    "DATABASE_URL",
    "postgresql://researchmind:researchmind@localhost:5432/researchmind",
)

os.environ.setdefault(
    "REDIS_URL",
    "redis://localhost:6379/0",
)

os.environ.setdefault(
    "QDRANT_URL",
    "http://localhost:6333",
)
