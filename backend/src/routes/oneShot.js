import { Router } from 'express';
import { z } from 'zod';
import { getOpenAI } from '../llm/client.js';

const router = Router();

const requestSchema = z.object({
  topic: z.string().min(3, 'topic must be at least 3 chars'),
  maxTokens: z.number().int().positive().optional(),
});

// One-shot prompting: Provide a single example to steer style/structure
router.post('/one-shot', async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { topic, maxTokens = 350 } = parsed.data;

  try {
    const openai = getOpenAI();

    // Example pair demonstrates the desired structure and tone
    const exampleUser = {
      role: 'user',
      content: 'Debate topic: School uniforms should be mandatory',
    };

    const exampleAssistant = {
      role: 'assistant',
      content: `PRO:\n- Encourage equality by reducing visible socioeconomic differences\n- Simplify morning routines and reduce decision fatigue\n- Improve school safety by making intruders more recognizable\n\nCON:\n- Limit personal expression and identity development\n- Create additional financial burden for families buying uniforms\n- Comfort and fit vary; may hinder student focus\n\nNeutral Summary: Uniforms can foster cohesion and safety but may limit expression and impose costs. A balanced policy could allow flexible, affordable options.`,
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: maxTokens,
      messages: [
        {
          role: 'system',
          content:
            'You are SpeakUp, an unbiased debate assistant for students. Produce balanced arguments with 3 bullet points for both PRO and CON, and a short neutral summary.',
        },
        exampleUser,
        exampleAssistant,
        {
          role: 'user',
          content: `Debate topic: ${topic}`,
        },
      ],
    });

    const text = response.choices?.[0]?.message?.content || '';
    res.json({ topic, output: text, meta: { model: 'gpt-4o-mini', strategy: 'one-shot' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'LLM call failed', details: err.message });
  }
});

export default router;