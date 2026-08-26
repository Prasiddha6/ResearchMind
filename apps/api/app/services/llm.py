from openai import AsyncOpenAI

from app.core.config import get_settings


SYSTEM_PROMPT = """You are ResearchMind, a research assistant.

Answer questions using only the supplied document context.

Rules:
1. Do not invent facts.
2. If the context does not contain enough evidence, say so clearly.
3. Keep answers concise but useful.
4. Cite supporting sources using [Source N] notation.
"""


async def generate_answer(
    question: str,
    contexts: list[dict],
) -> str:
    settings = get_settings()

    if not settings.openai_api_key:
        return (
            "LLM generation is not configured. "
            "Add OPENAI_API_KEY to .env to enable answers."
        )

    client = AsyncOpenAI(api_key=settings.openai_api_key)

    context = "\n\n".join(
        f"[Source {index + 1}] "
        f"{item['filename']} — page {item['page']}\n"
        f"{item['text']}"
        for index, item in enumerate(contexts)
    )

    response = await client.chat.completions.create(
        model=settings.openai_model,
        temperature=0.1,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    f"Document context:\n\n{context}\n\n"
                    f"Question: {question}"
                ),
            },
        ],
    )

    return response.choices[0].message.content or ""


async def answer_question(question: str):
    from app.services.retrieval import retrieve

    contexts = retrieve(question)

    if not contexts:
        return {
            "answer": "I could not find relevant information in the indexed documents.",
            "sources": [],
        }

    answer = await generate_answer(question, contexts)

    return {
        "answer": answer,
        "sources": [
            {
                "filename": item["filename"],
                "page": item["page"],
                "score": round(item["score"], 4),
            }
            for item in contexts
        ],
    }
