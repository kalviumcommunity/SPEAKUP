import { Router } from 'express';
import { z } from 'zod';
import { getOpenAI } from '../llm/client.js';

const router = Router();

const requestSchema = z.object({
  topic: z.string().min(3, 'topic must be at least 3 chars'),
  maxTokens: z.number().int().positive().optional(),
});

// Zero-shot prompting: No examples, just system + user prompt
router.post('/zero-shot', async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { topic, maxTokens = 300 } = parsed.data;

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
            'You are SpeakUp, an unbiased debate assistant for students. Produce balanced, concise arguments with 3 bullet points for both PRO and CON, and a short neutral summary.',
        },
        {
          role: 'user',
          content: `Debate topic: ${topic}`,
        },
      ],
    });

    const text = response.choices?.[0]?.message?.content || '';
    res.json({ topic, output: text, meta: { model: 'gpt-4o-mini', strategy: 'zero-shot' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'LLM call failed', details: err.message });
  }
});

export default router;