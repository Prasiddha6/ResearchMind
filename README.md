# ResearchMind

ResearchMind is a full-stack research assistant that uses Retrieval-Augmented Generation (RAG) to answer questions from uploaded research documents.

The system processes PDF documents, creates semantic embeddings, stores them in a vector database, retrieves relevant evidence, and generates grounded answers using an LLM.

## Project Links

- GitHub: https://github.com/Prasiddha6/ResearchMind
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health Check: http://localhost:8000/health

## Features

- PDF document upload
- PDF text extraction
- Document chunking
- Semantic embeddings
- Vector search with Qdrant
- Retrieval-Augmented Generation
- Grounded question answering
- Evidence and citation display
- Markdown answer rendering
- Document library
- Research session history
- FastAPI REST API
- Next.js frontend
- Backend testing
- Python linting and formatting
- Docker Compose infrastructure
- RAG evaluation dataset

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- ESLint

### Backend

- Python
- FastAPI
- Pydantic
- Uvicorn
- Pytest
- Ruff

### AI and Retrieval

- OpenAI
- Sentence Transformers
- Retrieval-Augmented Generation
- Semantic vector search

### Infrastructure

- Qdrant
- PostgreSQL
- Redis
- Docker Compose

## Architecture

```text
                         Researcher
                             |
                             v
                  +----------------------+
                  |    Next.js Frontend  |
                  |   Research Workspace |
                  +----------+-----------+
                             |
                             | HTTP / REST
                             v
                  +----------------------+
                  |    FastAPI Backend   |
                  +----------+-----------+
                             |
             +---------------+---------------+
             |                               |
             v                               v
    +------------------+            +------------------+
    |  PDF Processing  |            |   Chat Request   |
    +--------+---------+            +--------+---------+
             |                               |
             v                               v
    +------------------+            +------------------+
    | Text Chunking    |            | Query Embedding  |
    +--------+---------+            +--------+---------+
             |                               |
             v                               v
    +------------------+            +------------------+
    |    Embeddings    |----------->| Vector Retrieval |
    +--------+---------+            +--------+---------+
             |                               |
             v                               v
    +------------------+            +------------------+
    | Qdrant Vector DB |<-----------| Relevant Chunks  |
    +------------------+            +--------+---------+
                                             |
                                             v
                                  +---------------------+
                                  | Grounded LLM Answer |
                                  +----------+----------+
                                             |
                                             v
                                  +---------------------+
                                  | Answer + Evidence   |
                                  | + Citations         |
                                  +---------------------+
