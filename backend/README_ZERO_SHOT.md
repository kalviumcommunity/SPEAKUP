# Concept PR: Zero-shot prompting

This PR introduces a minimal backend with a single endpoint that demonstrates zero-shot prompting for debates.

## Endpoint
- `POST /api/prompt/zero-shot`
  - **body**:
    ```json
    { "topic": "AI replacing jobs – good or bad?", "maxTokens": 300 }
    ```
  - **response**:
    ```json
    {
      "topic": "...",
      "output": "...", 
      "meta": { "model": "gpt-4o-mini", "strategy": "zero-shot" }
    }
    ```

## Local setup
1. `cp .env.example .env` and set `OPENAI_API_KEY`.
2. `npm install`
3. `npm run dev`
4. Test with:
   ```bash
   curl -X POST http://localhost:4000/api/prompt/zero-shot \
     -H "Content-Type: application/json" \
     -d '{"topic":"AI replacing jobs – good or bad?"}'
   ```

## Notes
- Uses `system` + `user` messages only; no examples included.
- Output is intentionally concise to ease frontend rendering later.