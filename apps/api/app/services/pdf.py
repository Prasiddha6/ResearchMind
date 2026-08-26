from dataclasses import dataclass

import fitz


@dataclass
class DocumentChunk:
    text: str
    page: int


def extract_pages(data: bytes) -> list[tuple[int, str]]:
    document = fitz.open(stream=data, filetype="pdf")

    pages = []

    for index, page in enumerate(document):
        text = page.get_text("text").strip()

        if text:
            pages.append((index + 1, text))

    return pages


def chunk_text(
    text: str,
    page: int,
    chunk_size: int = 1200,
    overlap: int = 200,
) -> list[DocumentChunk]:
    words = text.split()
    chunks = []

    start = 0

    while start < len(words):
        end = min(start + chunk_size, len(words))

        chunks.append(
            DocumentChunk(
                text=" ".join(words[start:end]),
                page=page,
            )
        )

        if end == len(words):
            break

        start = end - overlap

    return chunks


def process_pdf(data: bytes) -> list[DocumentChunk]:
    chunks = []

    for page, text in extract_pages(data):
        chunks.extend(chunk_text(text, page))

    return chunks
