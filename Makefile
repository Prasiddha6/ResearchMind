.PHONY: api web test lint format

api:
	cd apps/api && uvicorn app.main:app --reload --port 8000

web:
	cd apps/web && npm run dev

test:
	cd apps/api && pytest

lint:
	cd apps/api && ruff check .

format:
	cd apps/api && ruff format .
