import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';


import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// ── Global rate limit: 100 req / 15 min per IP ────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      100,
  message:  { success: false, error: 'Too many requests. Please slow down.' },
}));

// ── Body parser ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Logger (dev only) ──────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── Health check ──────────────────────────────────────────────────────────
app.get('/api/health', (_, res) =>
  res.json({ success: true, message: 'WoolenStore API is running 🧶' })
);

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// 404
app.use((req, res) =>
  res.status(404).json({ success: false, error: `Route ${req.path} not found.` })
);

// ── Error handler (must be last) ───────────────────────────────────────────
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
});