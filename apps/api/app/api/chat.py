from fastapi import APIRouter

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.llm import answer_question

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    return await answer_question(request.question)
