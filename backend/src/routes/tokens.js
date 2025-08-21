import { Router } from 'express';
import { z } from 'zod';
import { budgetPrompt, estimateTokens } from '../llm/tokens.js';

const router = Router();

const schema = z.object({
  topic: z.string().min(3),
  maxBudget: z.number().int().positive().optional(),
});

router.post('/tokens', async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { topic, maxBudget = 8000 } = parsed.data;

  const messages = [
    { role: 'system', content: 'You are SpeakUp debate assistant.' },
    { role: 'user', content: `Debate topic: ${topic}` },
  ];
  const { used, remaining } = budgetPrompt(messages, maxBudget);
  res.json({ approx_tokens_used: used, approx_tokens_remaining: remaining });
});

router.post('/estimate', async (req, res) => {
  const text = String(req.body?.text || '');
  res.json({ tokens: estimateTokens(text) });
});

export default router;