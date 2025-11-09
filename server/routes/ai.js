import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// AI instruction processing endpoint
router.post('/process-instruction', async (req, res) => {
  try {
    if (!openai) {
      return res.status(500).json({
        error: 'OpenAI API key not configured on server'
      });
    }

    const { instruction, videoMetadata } = req.body;

    if (!instruction) {
      return res.status(400).json({ error: 'Instruction is required' });
    }

    // Enhanced system prompt for video editing
    const systemPrompt = `You are an expert video editing assistant. Analyze the user's natural language instruction and convert it into structured editing parameters.

Video metadata: ${videoMetadata ? JSON.stringify(videoMetadata) : 'Not provided'}

Return a JSON object with the following structure:
{
  "action": "trim|cut|merge|split|speed|filter|audio|text|transition|crop|resize",
  "parameters": {
    // Action-specific parameters
  },
  "description": "Human-readable description of what will be done",
  "technicalSteps": ["step1", "step2", ...]
}

Supported actions:
- trim: Remove sections from start/end (params: start, end in seconds)
- cut: Remove middle section (params: start, end in seconds)
- split: Split video into parts (params: timestamps array)
- speed: Change playback speed (params: speed multiplier, e.g., 0.5, 1.5, 2)
- filter: Apply visual effects (params: filter name - grayscale, sepia, brightness, contrast, blur, sharpen)
- audio: Audio operations (params: operation - mute, volume, fade, normalize; value if needed)
- text: Add text overlay (params: text, position, duration, fontSize, color)
- transition: Add transitions (params: type - fade, dissolve, wipe; duration)
- crop: Crop video (params: width, height, x, y)
- resize: Resize video (params: width, height, maintain aspect ratio)`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: instruction }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;
    const editingData = JSON.parse(aiResponse);

    res.json({
      success: true,
      instruction,
      aiResponse: editingData,
      usage: completion.usage
    });

  } catch (error) {
    console.error('AI processing error:', error);
    res.status(500).json({
      error: 'Failed to process instruction',
      details: error.message
    });
  }
});

// Chat endpoint for general video editing questions
router.post('/chat', async (req, res) => {
  try {
    if (!openai) {
      return res.status(500).json({
        error: 'OpenAI API key not configured on server'
      });
    }

    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const messages = [
      {
        role: 'system',
        content: 'You are a helpful video editing assistant. Provide clear, concise advice about video editing techniques, best practices, and creative suggestions.'
      },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.8,
      max_tokens: 500
    });

    const reply = completion.choices[0].message.content;

    res.json({
      success: true,
      reply,
      usage: completion.usage
    });

  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      error: 'Failed to process chat message',
      details: error.message
    });
  }
});

export default router;
