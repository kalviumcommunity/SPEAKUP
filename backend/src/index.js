import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import zeroShotRouter from './routes/zeroShot.js';
import oneShotRouter from './routes/oneShot.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'speakup-backend', version: '1.0.0' });
});

app.use('/api/prompt', zeroShotRouter);
app.use('/api/prompt', oneShotRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`SpeakUp backend running on http://localhost:${PORT}`);
});