import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './database/db.js';
import uploadRoutes from './routes/upload.js';
import projectRoutes from './routes/projects.js';
import aiRoutes from './routes/ai.js';
import videoRoutes from './routes/video.js';
import exportRoutes from './routes/export.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, '..')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/export', exportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LuminaCut AI Editor Backend is running' });
});

// Initialize database
initDatabase();

// Start server
app.listen(PORT, () => {
  console.log(`🎬 LuminaCut AI Editor Backend running on http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ${process.env.UPLOAD_DIR || './uploads'}`);
  console.log(`🤖 OpenAI API: ${process.env.OPENAI_API_KEY ? 'Configured ✓' : 'Not configured ✗'}`);
});

export default app;
