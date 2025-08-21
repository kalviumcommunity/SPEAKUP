import OpenAI from 'openai';

// Creates a singleton OpenAI client using env var OPENAI_API_KEY
let openAiClient;
export function getOpenAI() {
  if (!openAiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing OPENAI_API_KEY in environment');
    }
    openAiClient = new OpenAI({ apiKey });
  }
  return openAiClient;
}