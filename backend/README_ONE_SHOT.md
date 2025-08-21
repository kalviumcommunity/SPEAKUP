# Concept PR: One-shot prompting

Adds a new endpoint that demonstrates one-shot prompting (a single example to steer structure and tone).

## Endpoint
- `POST /api/prompt/one-shot`
  - **body**:
    ```json
    { "topic": "Homework should be banned", "maxTokens": 350 }
    ```
  - **response**:
    ```json
    {
      "topic": "...",
      "output": "...",
      "meta": { "model": "gpt-4o-mini", "strategy": "one-shot" }
    }
    ```

## Local testing
```bash
curl -X POST http://localhost:4000/api/prompt/one-shot \
  -H "Content-Type: application/json" \
  -d '{"topic":"Homework should be banned"}'
```

## Notes
- Includes one example QA pair to bias the output format toward PRO/CON + Neutral Summary.
- Same system instruction and model as zero-shot for easy comparison.