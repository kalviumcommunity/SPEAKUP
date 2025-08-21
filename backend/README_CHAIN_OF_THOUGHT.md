# Concept PR: Chain-of-Thought (CoT)

Demonstrates internal step-by-step reasoning while exposing only the final concise output.

## Endpoint
- `POST /api/prompt/chain-of-thought`

## Test
```bash
curl -X POST http://localhost:4000/api/prompt/chain-of-thought \
  -H "Content-Type: application/json" \
  -d '{"topic":"AI replacing jobs – good or bad?"}'
```

## Notes
- Prompts the model to reason internally and only output final structured content.