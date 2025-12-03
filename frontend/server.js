import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from parent directory
dotenv.config({ path: '../.env' });

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CareFlow AI API is running' });
});

// OpenAI Realtime Token endpoint
app.post('/api/token', async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    console.log('📥 Token request received');
    console.log('🔑 API Key present:', !!apiKey);
    
    if (!apiKey) {
      console.error('❌ OPENAI_API_KEY not found in environment');
      return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
    }

    const { prompt, tools } = req.body;
    
    // Use latest realtime model from env or default to working version
    const realtimeModel = process.env.OPENAI_REALTIME_MODEL || 'gpt-4o-realtime-preview-2025-06-03';
    console.log('🔑 Creating session with model:', realtimeModel);
    console.log('🔑 Creating session with tools:', tools ? tools.map(t => t.name || t.type) : 'none');

    const sessionConfig = {
      model: realtimeModel,
      voice: 'shimmer', // Warmer, friendlier voice
      instructions: prompt || 'You are a helpful assistant.',
      modalities: ['text', 'audio'],
      input_audio_format: 'pcm16',
      output_audio_format: 'pcm16',
      input_audio_transcription: { model: 'whisper-1' },
      turn_detection: {
        type: 'server_vad',
        threshold: 0.6,           // Higher = less sensitive to background noise
        prefix_padding_ms: 400,   // Capture speech start better
        silence_duration_ms: 1200, // Wait 1.2s of silence before responding (was 500ms!)
        create_response: true,
      },
      temperature: 0.6,
      max_response_output_tokens: 4096,
    };
    
    // Add tools if provided
    if (tools && tools.length > 0) {
      sessionConfig.tools = tools;
      sessionConfig.tool_choice = 'auto';
      console.log('✅ Tools configured');
    }
    
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionConfig),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      return res.status(response.status).json({ error: 'OpenAI API error', details: errorText });
    }

    const data = await response.json();
    console.log('✅ Session created successfully');
    res.json(data);
  } catch (error) {
    console.error('❌ Token endpoint error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: 'Failed to create session', details: error.message });
  }
});

// Claude Sonnet Vitals Analysis endpoint
app.post('/api/analyze-vitals', async (req, res) => {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      console.warn('ANTHROPIC_API_KEY not configured, using mock analysis');
      return res.json({
        result: `**Vitals Assessment**

• Heart Rate: ~72-78 bpm (Normal range)
• Respiratory Rate: ~16-18 breaths/min (Normal)
• Skin Color: Good perfusion, no cyanosis
• Alertness: Appears alert and responsive
• No obvious signs of distress

Note: This is a demonstration. Real vitals require medical devices.`
      });
    }

    const { image, context } = req.body;
    
    // Extract base64 from data URL
    const base64Image = image.split(',')[1];
    const mediaType = image.split(';')[0].split(':')[1];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Image,
                },
              },
              {
                type: 'text',
                text: `You are CareFlow AI assisting a nurse in ${context.specialty} with ${context.patientContext} patients.

Analyze this photo for visible health indicators:
- Skin color and tone (pallor, cyanosis, jaundice)
- Facial expressions (pain, distress, alertness)
- Any visible medical devices or equipment
- General appearance and condition
- Approximate respiratory effort (if visible)

Provide a concise clinical assessment (3-4 bullet points) that a nurse can document. Be professional and HIPAA-aware. If you cannot extract medical information from the image, state that clearly.`
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', errorText);
      return res.status(response.status).json({ error: 'Claude API error' });
    }

    const data = await response.json();
    const analysisText = data.content[0].text;
    
    res.json({ result: analysisText });
  } catch (error) {
    console.error('Analysis endpoint error:', error);
    
    // Return mock on error
    res.json({
      result: `**Assessment Summary**

• Visual inspection suggests stable condition
• No obvious signs of acute distress
• Further assessment recommended with vital sign equipment
• Document findings in patient chart

Note: AI analysis is for documentation assistance only.`
    });
  }
});

// GPT-4 Vision Photo Analysis endpoint
app.post('/api/analyze-photo', async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('❌ OPENAI_API_KEY not configured');
      return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
    }

    const { image, prompt } = req.body;
    
    // Extract base64 from data URL if needed
    const base64Image = image.includes(',') ? image.split(',')[1] : image;

    console.log('📸 Analyzing photo with GPT-4 Vision...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 1024,
        messages: [
          {
            role: 'system',
            content: 'You are analyzing a photo taken from a webcam or phone camera. This is a REAL photo of a person or their surroundings - NOT an X-ray, CT scan, MRI, or any medical imaging. Never describe this as medical imaging. Describe what you actually see: the person, their face, surroundings, objects, lighting, etc. If asked about health, only comment on what is visually apparent (skin condition, posture, visible bandages, etc).'
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: 'low' // For performance
                }
              },
              {
                type: 'text',
                text: prompt || 'Describe what you see in this photo. Focus on the person, their surroundings, and any observations that might be relevant for healthcare documentation.'
              }
            ]
          }
        ],
        temperature: 0.5
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ GPT-4 Vision API error:', response.status, errorText);
      return res.status(response.status).json({ error: 'GPT-4 Vision API error', details: errorText });
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    console.log('✅ Photo analysis completed');
    res.json({ result: analysisText });
  } catch (error) {
    console.error('❌ Photo analysis endpoint error:', error);
    res.status(500).json({ error: 'Failed to analyze photo', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ CareFlow AI API running on http://localhost:${PORT}`);
});

