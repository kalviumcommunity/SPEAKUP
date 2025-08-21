import { Router } from 'express';
import { z } from 'zod';
import { getOpenAI } from '../llm/client.js';

const router = Router();

const requestSchema = z.object({
  topic: z.string().min(3, 'topic must be at least 3 chars'),
  maxTokens: z.number().int().positive().optional(),
});

// Chain-of-Thought (CoT): encourage stepwise reasoning, but return concise final answer.
router.post('/chain-of-thought', async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { topic, maxTokens = 380 } = parsed.data;

  try {
    const openai = getOpenAI();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: maxTokens,
      messages: [
        {
          role: 'system',
          content:
            'You are SpeakUp. Think step by step to evaluate arguments, but only expose a concise final answer. Use the internal scratchpad to reason, then output: PRO (3 bullets), CON (3 bullets), Neutral Summary (2 sentences). Do not reveal the scratchpad.',
        },
        { role: 'user', content: `Debate topic: ${topic}\nUse stepwise reasoning internally.` },
      ],
    });

    const text = response.choices?.[0]?.message?.content || '';
    res.json({ topic, output: text, meta: { model: 'gpt-4o-mini', strategy: 'chain-of-thought' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'LLM call failed', details: err.message });
  }
});

export default router;