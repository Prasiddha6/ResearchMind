from uuid import uuid4

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

from app.core.config import get_settings
from app.services.embeddings import embed_texts

COLLECTION = "research_documents"
VECTOR_SIZE = 384


def get_client():
    settings = get_settings()
    return QdrantClient(url=settings.qdrant_url)


def ensure_collection():
    client = get_client()

    collections = {
        collection.name for collection in client.get_collections().collections
    }

    if COLLECTION not in collections:
        client.create_collection(
            collection_name=COLLECTION,
            vectors_config=VectorParams(
                size=VECTOR_SIZE,
                distance=Distance.COSINE,
            ),
        )


def index_chunks(
    document_id: str,
    filename: str,
    chunks,
):
    ensure_collection()

    vectors = embed_texts([chunk.text for chunk in chunks])

    points = []

    for chunk, vector in zip(chunks, vectors):
        points.append(
            PointStruct(
                id=str(uuid4()),
                vector=vector,
                payload={
                    "document_id": document_id,
                    "filename": filename,
                    "page": chunk.page,
                    "text": chunk.text,
                },
            )
        )

    get_client().upsert(
        collection_name=COLLECTION,
        points=points,
    )

    return len(points)
