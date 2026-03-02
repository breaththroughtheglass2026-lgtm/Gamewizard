import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// API Health Check
app.get('/api/health', (req, res) => {
  const hasKey = !!process.env.GROQ_API_KEY;
  res.json({
    status: 'ok',
    hasGroqKey: hasKey,
    message: hasKey ? 'Groq API key configured' : 'WARNING: Groq API key not configured',
  });
});

// Main API endpoint for Groq calls
app.post('/api/generate-game', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error: 'Groq API key not configured. Check your .env.local file.',
      });
    }

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `You are an expert game developer. Based on this game idea, provide a detailed game design document: "${prompt}". Include: game mechanics, story, assets needed, and key features.`,
        },
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response = chatCompletion.choices[0]?.message?.content || 'No response generated';

    res.json({
      success: true,
      response,
      model: 'mixtral-8x7b-32768',
    });
  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate game design',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Alternative endpoint for code generation
app.post('/api/generate-code', async (req, res) => {
  try {
    const { prompt, language = 'javascript' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error: 'Groq API key not configured',
      });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Generate ${language} code for a game with this description: "${prompt}". Provide working, complete code that can run immediately.`,
        },
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.9,
      max_tokens: 2048,
    });

    const code = chatCompletion.choices[0]?.message?.content || 'No code generated';

    res.json({
      success: true,
      code,
      language,
    });
  } catch (error) {
    console.error('Code Generation Error:', error);
    res.status(500).json({
      error: 'Failed to generate code',
    });
  }
});

// Debugging endpoint to test API key
app.get('/api/test-key', async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      return res.json({
        configured: false,
        message: 'GROQ_API_KEY not set in .env.local',
      });
    }

    // Test the key with a simple request
    const test = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: 'Say "API Key is working!" in exactly 5 words.',
        },
      ],
      model: 'mixtral-8x7b-32768',
      max_tokens: 50,
    });

    res.json({
      configured: true,
      working: true,
      response: test.choices[0]?.message?.content,
    });
  } catch (error) {
    res.json({
      configured: !!process.env.GROQ_API_KEY,
      working: false,
      error: error.message,
    });
  }
});

// Root endpoint serves index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🎮 CANVAS Server running at http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  - POST /api/generate-game - Generate game design`);
  console.log(`  - POST /api/generate-code - Generate game code`);
  console.log(`  - GET /api/test-key - Test API key configuration`);
  console.log(`  - GET /api/health - Health check`);

  // Check if API key is configured
  if (!process.env.GROQ_API_KEY) {
    console.warn('⚠️  WARNING: GROQ_API_KEY is not set!');
    console.warn('Create a .env.local file and add your Groq API key:');
    console.warn('GROQ_API_KEY=your_api_key_here');
  } else {
    console.log('✅ GROQ_API_KEY configured');
  }
});
