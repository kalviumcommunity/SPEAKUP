# Concept PR: Structured Output (JSON)

Adds a route that returns validated JSON following a fixed schema.

## Endpoint
- `POST /api/prompt/structured`

## Example
```bash
curl -X POST http://localhost:4000/api/prompt/structured \
  -H "Content-Type: application/json" \
  -d '{"topic":"AI replacing jobs – good or bad?"}'
```