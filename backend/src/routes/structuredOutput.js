import { Router } from 'express';
import { z } from 'zod';
import { getOpenAI } from '../llm/client.js';

const router = Router();

const requestSchema = z.object({
  topic: z.string().min(3),
  schemaVersion: z.string().default('1'),
  temperature: z.number().min(0).max(2).optional(),
});

// Define schema using Zod for validation after the model responds
const DebateSchemaV1 = z.object({
  topic: z.string(),
  pro: z.array(z.string()).length(3),
  con: z.array(z.string()).length(3),
  summary: z.string(),
});

router.post('/structured', async (req, res) => {
  const parsed = requestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { topic, schemaVersion, temperature = 0.4 } = parsed.data;

  try {
    const openai = getOpenAI();

    const schemaDescription = `JSON schema v${schemaVersion}:
    { "topic": string, "pro": string[3], "con": string[3], "summary": string }`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature,
      messages: [
        { role: 'system', content: 'Output valid minified JSON only. No extra text.' },
        {
          role: 'user',
          content: `Produce JSON following this schema. ${schemaDescription}\nTopic: ${topic}`,
        },
      ],
    });

    const raw = response.choices?.[0]?.message?.content?.trim() || '';

    // Try to parse as JSON; if fenced, strip fences
    const cleaned = raw.replace(/^```json\n?|```$/g, '');
    let parsedJson;
    try {
      parsedJson = JSON.parse(cleaned);
    } catch (e) {
      return res.status(500).json({ error: 'Invalid JSON from model', raw });
    }

    const validated = DebateSchemaV1.safeParse(parsedJson);
    if (!validated.success) {
      return res.status(400).json({ error: 'JSON failed validation', issues: validated.error.flatten(), raw: parsedJson });
    }

    res.json({ data: validated.data, meta: { model: 'gpt-4o-mini', schemaVersion } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'LLM call failed', details: err.message });
  }
});

export default router;