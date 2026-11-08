import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI client with required header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Analyze Face using gemini-4-argon
app.post('/api/analyze-face', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    if (!apiKey) {
      // Graceful response when API key is not yet set
      return res.json({
        analysis: {
          facialExpression: 'Focused and poised',
          lightingConditions: 'Soft ambient illumination',
          recommendedEras: ['Renaissance Florence (1504)', 'Victorian Steampunk (1888)', 'Ancient Egypt (1300 BCE)'],
          aestheticArchetype: 'Classical Scholar & Royal Diplomat',
          eraCompatibilityScore: 96,
          historicalStylingAdvice: 'Strong cheekbones and thoughtful gaze ideal for Renaissance oil glaze or Victorian wet-plate collodion portraits.',
          suggestedAccessories: ['Velvet scholar beret', 'Gilded pocket watch', 'Lapis lazuli pharaonic amulet'],
        },
        notice: 'Default historical analysis loaded (add GEMINI_API_KEY in Secrets for live AI analysis).',
      });
    }

    // Clean base64 data if it contains data URI prefix
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-4-argon',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
          {
            text: `Analyze this portrait photo for a historical time-travel transformation app. 
Analyze the facial features, expression, lighting, and suggest the best historical eras that would suit this person's look. 
Return your response in pure JSON format matching this schema:
{
  "facialExpression": "string (e.g., confident, introspective, heroic)",
  "lightingConditions": "string (e.g., directional natural light, warm studio)",
  "recommendedEras": ["array of 3 strings of specific historical eras and years"],
  "aestheticArchetype": "string (e.g., Renaissance Artisan, Roman Patrician, 1920s Jazz Virtuoso)",
  "eraCompatibilityScore": number (between 80 and 99),
  "historicalStylingAdvice": "string with advice on costumes, hair, and lighting to enhance authenticity",
  "suggestedAccessories": ["array of 3 authentic historical items/props"]
}`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch {
      analysis = {
        facialExpression: 'Majestic & expressive',
        lightingConditions: 'Evenly balanced portrait lighting',
        recommendedEras: ['Renaissance Florence', 'Victorian London', 'Roaring Twenties'],
        aestheticArchetype: 'Visionary Explorer',
        eraCompatibilityScore: 94,
        historicalStylingAdvice: 'Subtle period costume blending and authentic vintage color toning recommended.',
        suggestedAccessories: ['Brass astrolabe', 'Art Deco pocket square', 'Velvet cape'],
      };
    }

    return res.json({ analysis });
  } catch (error: any) {
    console.error('Error analyzing image with gemini-4-argon:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze face',
      fallback: {
        facialExpression: 'Charismatic and timeless',
        lightingConditions: 'Frontal portrait lighting',
        recommendedEras: ['Renaissance Florence (1504)', 'Victorian Steampunk (1888)', 'Edo Japan (1680)'],
        aestheticArchetype: 'Historic Luminary',
        eraCompatibilityScore: 92,
        historicalStylingAdvice: 'Ideal for classical chiaroscuro oil painting style.',
        suggestedAccessories: ['Antique compass', 'Embroidered collar', 'Leather bound tome'],
      },
    });
  }
});

// Endpoint: Time-travel image creation & custom prompt editing using gemini-nano-banana-2.1
app.post('/api/generate-time-travel', async (req: Request, res: Response) => {
  try {
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      eraName,
      eraPrompt,
      customEditPrompt = '',
      imageSize = '1K',
      aspectRatio = '1:1',
    } = req.body;

    if (!imageBase64 && !customEditPrompt) {
      return res.status(400).json({ error: 'Image or prompt required' });
    }

    if (!apiKey) {
      return res.status(200).json({
        success: false,
        requiresApiKey: true,
        message: 'No GEMINI_API_KEY detected. Use client-side temporal blending or set your key in Secrets.',
      });
    }

    const cleanBase64 = imageBase64 ? imageBase64.replace(/^data:image\/\w+;base64,/, '') : '';

    const compositePrompt = `Create a masterpiece historical portrait inserting the face and facial likeness of the person in the provided photo into the following historical era: ${eraName || 'Historical Scene'}.
Details of the scene: ${eraPrompt}.
${customEditPrompt ? `User custom adjustments: ${customEditPrompt}.` : ''}
The portrait must faithfully preserve the person's facial geometry, eye shape, nose, mouth, and expression while rendering them in completely authentic period clothing, hair styling, lighting, textures, and painterly/photographic aesthetics of that epoch. High realism, museum quality detail.`;

    const parts: any[] = [];
    if (cleanBase64) {
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: cleanBase64,
        },
      });
    }
    parts.push({
      text: compositePrompt,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-nano-banana-2.1',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: imageSize as any,
        },
      },
    });

    let generatedImageUrl = '';
    let responseText = '';

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType ?? 'image/png';
        generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        responseText += part.text;
      }
    }

    if (generatedImageUrl) {
      return res.json({
        success: true,
        imageUrl: generatedImageUrl,
        description: responseText,
      });
    } else {
      return res.json({
        success: false,
        message: responseText || 'No image data returned from model. Using client temporal synthesis.',
      });
    }
  } catch (error: any) {
    console.error('Error generating image with gemini-nano-banana-2.1:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Image generation failed',
    });
  }
});

// Endpoint: Edit existing image using gemini-nano-banana-2.1
app.post('/api/edit-image', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/png', editPrompt, imageSize = '1K', aspectRatio = '1:1' } = req.body;

    if (!imageBase64 || !editPrompt) {
      return res.status(400).json({ error: 'Image and editPrompt are required' });
    }

    if (!apiKey) {
      return res.status(200).json({
        success: false,
        requiresApiKey: true,
        message: 'No GEMINI_API_KEY detected. Use client-side filters or set your key in Secrets.',
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-nano-banana-2.1',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64,
            },
          },
          {
            text: `Edit this historical portrait according to the following instruction: ${editPrompt}. Maintain face identity and overall period atmosphere while applying the requested change.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: imageSize as any,
        },
      },
    });

    let editedImageUrl = '';
    let responseText = '';

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType ?? 'image/png';
        editedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
      } else if (part.text) {
        responseText += part.text;
      }
    }

    if (editedImageUrl) {
      return res.json({
        success: true,
        imageUrl: editedImageUrl,
        description: responseText,
      });
    } else {
      return res.json({
        success: false,
        message: responseText || 'No image data returned from model.',
      });
    }
  } catch (error: any) {
    console.error('Error editing image with gemini-nano-banana-2.1:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Image edit failed',
    });
  }
});

// App status check
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    serverTime: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ChronosSnap server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
