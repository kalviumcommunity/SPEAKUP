import { Router } from 'express';
import { z } from 'zod';
import { getOpenAI } from '../llm/client.js';

const router = Router();

const requestSchema = z.object({
  topic: z.string().min(3, 'topic must be at least 3 chars'),
  maxTokens: z.number().int().positive().optional(),
});

// Multi-shot prompting: Provide multiple examples to steer style/structure further
router.post('/multi-shot', async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { topic, maxTokens = 380 } = parsed.data;

  try {
    const openai = getOpenAI();

    const examples = [
      {
        role: 'user',
        content: 'Debate topic: Homework should be banned',
      },
      {
        role: 'assistant',
        content:
          'PRO:\n- Reduces stress and improves student well-being\n- Frees time for extracurriculars and family\n- Minimizes inequality from home resource gaps\n\nCON:\n- Missed practice may slow skill mastery\n- Limits opportunities for self-directed learning\n- Harder for teachers to reinforce lessons\n\nNeutral Summary: Homework can reinforce skills but may harm well-being when excessive. Balanced, purposeful assignments can help.',
      },
      {
        role: 'user',
        content: 'Debate topic: School days should start later',
      },
      {
        role: 'assistant',
        content:
          'PRO:\n- Aligns with teen sleep cycles; boosts alertness\n- May improve attendance and academic outcomes\n- Supports mental health and mood stability\n\nCON:\n- Conflicts with parent work schedules and activities\n- Transportation and logistics become harder\n- Less daylight for after-school commitments\n\nNeutral Summary: Later starts improve sleep and focus but complicate logistics. Pilots with community input can find balance.',
      },
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: maxTokens,
      messages: [
        {
          role: 'system',
          content:
            'You are SpeakUp, an unbiased debate assistant. Mirror the shown structure: PRO (3 bullets), CON (3 bullets), Neutral Summary (2 sentences).',
        },
        ...examples,
        { role: 'user', content: `Debate topic: ${topic}` },
      ],
    });

    const text = response.choices?.[0]?.message?.content || '';
    res.json({ topic, output: text, meta: { model: 'gpt-4o-mini', strategy: 'multi-shot' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'LLM call failed', details: err.message });
  }
});

export default router;