from app.services.embeddings import embed_texts
from app.services.vector_store import COLLECTION, get_client


def retrieve(query: str, limit: int = 5):
    vector = embed_texts([query])[0]

    results = get_client().query_points(
        collection_name=COLLECTION,
        query=vector,
        limit=limit,
        with_payload=True,
    )

    return [
        {
            "score": point.score,
            "text": point.payload["text"],
            "page": point.payload["page"],
            "filename": point.payload["filename"],
            "document_id": point.payload["document_id"],
        }
        for point in results.points
    ]
