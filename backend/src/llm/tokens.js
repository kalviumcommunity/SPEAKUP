// Simple token estimation based on OpenAI tiktoken-approximation
// Not exact; for budgeting.
export function estimateTokens(text) {
  // Rough heuristic: 1 token ~ 4 chars in English; clamp at minimum 1
  const approx = Math.ceil(text.length / 4);
  return Math.max(1, approx);
}

export function budgetPrompt(messages, maxBudget = 8000) {
  // messages: [{role, content}]
  const joined = messages.map(m => `${m.role}: ${m.content}`).join('\n');
  const used = estimateTokens(joined);
  const remaining = Math.max(0, maxBudget - used);
  return { used, remaining };
}