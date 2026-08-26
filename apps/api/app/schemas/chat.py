from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    question: str = Field(min_length=2, max_length=2000)


class Source(BaseModel):
    filename: str
    page: int
    score: float


class ChatResponse(BaseModel):
    answer: str
    sources: list[Source]
