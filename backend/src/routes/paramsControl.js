import { Router } from 'express';
import { z } from 'zod';
import { getOpenAI } from '../llm/client.js';

const router = Router();

const requestSchema = z.object({
  topic: z.string().min(3),
  temperature: z.number().min(0).max(2).optional(),
  top_p: z.number().min(0).max(1).optional(),
  // Note: OpenAI doesn't expose top_k; we simulate via prompt guidance only.
  top_k: z.number().int().min(1).max(100).optional(),
  stop: z.array(z.string()).optional(),
  maxTokens: z.number().int().positive().optional(),
});

router.post('/params', async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { topic, temperature = 0.7, top_p = 1, top_k, stop, maxTokens = 320 } = parsed.data;

  try {
    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature,
      top_p,
      max_tokens: maxTokens,
      stop,
      messages: [
        {
          role: 'system',
          content:
            'You are SpeakUp. Produce PRO/CON with 3 bullets each, then a neutral summary. Keep output under 220 words.',
        },
        {
          role: 'user',
          content:
            `Debate topic: ${topic}` + (top_k ? `\nWhen uncertain, consider only the ${top_k} most likely continuations.` : ''),
        },
      ],
    });

    res.json({
      topic,
      output: response.choices?.[0]?.message?.content || '',
      meta: { model: 'gpt-4o-mini', temperature, top_p, top_k: top_k ?? null, stop: stop ?? null },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'LLM call failed', details: err.message });
  }
});

export default router;