from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.pdf import process_pdf
from app.services.vector_store import index_chunks

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported.",
        )

    data = await file.read()

    if not data:
        raise HTTPException(
            status_code=400,
            detail="The uploaded PDF is empty.",
        )

    document_id = str(uuid4())
    chunks = process_pdf(data)

    if not chunks:
        raise HTTPException(
            status_code=422,
            detail="No readable text was found in the PDF.",
        )

    indexed = index_chunks(
        document_id=document_id,
        filename=file.filename or "document.pdf",
        chunks=chunks,
    )

    return {
        "document_id": document_id,
        "filename": file.filename,
        "chunks_indexed": indexed,
        "status": "indexed",
    }
