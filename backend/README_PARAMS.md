# Concept PR: Parameters — Temperature, Top-P, (Top-K via prompt), Stop Sequences

Adds a flexible endpoint to experiment with sampling controls and stop sequences.

## Endpoint
- `POST /api/prompt/params`

### Body
```json
{
  "topic": "Should social media have age verification?",
  "temperature": 0.3,
  "top_p": 0.9,
  "top_k": 5,
  "stop": ["Neutral Summary:"],
  "maxTokens": 320
}
```

### Notes
- OpenAI chat API supports `temperature`, `top_p`, `stop`, `max_tokens`.
- `top_k` is simulated through an instruction nudge in the user prompt.