.PHONY: api web test lint format frontend-lint frontend-build check

api:
	cd apps/api && uvicorn app.main:app --reload --port 8000

web:
	cd apps/web && npm run dev

test:
	cd apps/api && PYTHONPATH=. python -m pytest ../../tests -q

lint:
	cd apps/api && python -m ruff check .

format:
	cd apps/api && python -m ruff format .

frontend-lint:
	cd apps/web && npm run lint

frontend-build:
	cd apps/web && npm run build

check: lint frontend-lint test frontend-build
	@echo ""
	@echo "=========================================="
	@echo "ResearchMind quality gate passed"
	@echo "=========================================="
