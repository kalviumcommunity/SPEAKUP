# Concept PR: Multi-shot prompting

Adds an endpoint that uses multiple examples to bias both format and tone.

## Endpoint
- `POST /api/prompt/multi-shot`

### Request
```json
{ "topic": "Ban smartphones in classrooms?", "maxTokens": 380 }
```

### Response
```json
{
  "topic": "...",
  "output": "...",
  "meta": { "model": "gpt-4o-mini", "strategy": "multi-shot" }
}
```

## Test
```bash
curl -X POST http://localhost:4000/api/prompt/multi-shot \
  -H "Content-Type: application/json" \
  -d '{"topic":"Ban smartphones in classrooms?"}'
```