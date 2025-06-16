const http = require('https');
const OpenAI = require('openai');
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const nebiusClient = new OpenAI({
    baseURL: 'https://api.studio.nebius.com/v1/',
    apiKey: process.env.NEXT_PUBLIC_NEBIUS_API_KEY,
});

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const MAX_RETRIES = 3;
const TIMEOUT = 30000; // 30 seconds

export const generateScriptAndImages = async (topic, customPrompt = null) => {
    if (!topic) {
        throw new Error('Topic is required');
    }

    // For demo purposes, return mock data if API keys are not available
    if (!apiKey) {
        console.warn('Gemini API key not found, returning mock data');
        return {
            scripts: [
                {
                    content: `Welcome to our amazing journey exploring ${topic}. This is an engaging story that will captivate your audience from the very first second. We'll dive deep into the fascinating world of ${topic} and discover incredible insights that will leave you amazed. Get ready for an unforgettable experience that combines education with entertainment in the most compelling way possible.`,
                    scenes: [
                        {
                            Scenecontent: `Welcome to our amazing journey exploring ${topic}`,
                            imagePrompt: `A stunning cinematic opening scene showing ${topic}, highly detailed, professional photography, vibrant colors, dramatic lighting`
                        },
                        {
                            Scenecontent: "This is an engaging story that will captivate your audience",
                            imagePrompt: `An engaging visual representation of storytelling, cinematic composition, warm lighting, professional quality`
                        },
                        {
                            Scenecontent: `We'll dive deep into the fascinating world of ${topic}`,
                            imagePrompt: `A deep dive visual metaphor related to ${topic}, artistic composition, rich colors, high quality photography`
                        },
                        {
                            Scenecontent: "Get ready for an unforgettable experience",
                            imagePrompt: `An exciting conclusion scene, dynamic composition, bright lighting, professional cinematography`
                        }
                    ]
                }
            ]
        };
    }

    let retryCount = 0;

    while (retryCount <= MAX_RETRIES) {
        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
            });

            const generationConfig = {
                temperature: 0.7,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
                responseMimeType: "application/json",
            };

            const chatSession = model.startChat({
                generationConfig,
                history: [],
            });

            const userPrompt = customPrompt || `Write two different YouTube Shorts scripts, each for a 60 second video on the topic: ${topic}. 
Make both scripts engaging, with strong hooks in the first few seconds to grab attention. 
Keep the content concise, informative, or entertaining based on the topic. 
Avoid any scene descriptions or stage directions in the script. 
Do not use newlines, slashes, or braces in the content text—just the plain story text. 
For each script, break it down into scenes based on logical flow (e.g., hook, story, twist, or moral). 
For every scene, provide:
Scenecontent: A line or phrase directly from the script. 
imagePrompt: A corresponding highly detailed image generation prompt that accurately matches the scene content. 
Respond only in JSON format, following this schema:
{
  "scripts": [
    {
      "content": "Script text here",
      "scenes": [
        {
          "Scenecontent": "Scene text here from content",
          "imagePrompt": "Respective, highly detailed image prompt accurate to the scene content"
        }
      ]
    }
  ]
}`;

            const result = await chatSession.sendMessage(userPrompt);
            const responseText = result.response.text();

            console.log('Raw Gemini API response:', responseText);

            // Try to parse the response
            let finalResponse;
            try {
                finalResponse = JSON.parse(responseText);
            } catch (parseError) {
                console.error('Failed to parse response as JSON:', parseError);
                console.log('Response text:', responseText);
                throw new Error('Failed to parse response as JSON');
            }

            // Validate the response structure
            if (!finalResponse.scripts || !Array.isArray(finalResponse.scripts)) {
                console.error('Invalid response structure:', finalResponse);
                throw new Error('Invalid response format: missing scripts array');
            }

            // Validate each script
            finalResponse.scripts.forEach((script, index) => {
                if (!script.content || !script.scenes || !Array.isArray(script.scenes)) {
                    console.error(`Invalid script structure at index ${index}:`, script);
                    throw new Error(`Invalid script structure at index ${index}`);
                }
            });

            return finalResponse;

        } catch (error) {
            console.error(`Attempt ${retryCount + 1}/${MAX_RETRIES + 1} failed:`, error);

            if (retryCount >= MAX_RETRIES) {
                // Return mock data as fallback
                console.warn('All API attempts failed, returning mock data');
                return {
                    scripts: [
                        {
                            content: `Welcome to our amazing journey exploring ${topic}. This is an engaging story that will captivate your audience from the very first second. We'll dive deep into the fascinating world of ${topic} and discover incredible insights that will leave you amazed.`,
                            scenes: [
                                {
                                    Scenecontent: `Welcome to our amazing journey exploring ${topic}`,
                                    imagePrompt: `A stunning cinematic opening scene showing ${topic}, highly detailed, professional photography, vibrant colors, dramatic lighting`
                                },
                                {
                                    Scenecontent: "This is an engaging story that will captivate your audience",
                                    imagePrompt: `An engaging visual representation of storytelling, cinematic composition, warm lighting, professional quality`
                                },
                                {
                                    Scenecontent: `We'll dive deep into the fascinating world of ${topic}`,
                                    imagePrompt: `A deep dive visual metaphor related to ${topic}, artistic composition, rich colors, high quality photography`
                                }
                            ]
                        }
                    ]
                };
            }

            // Wait with exponential backoff before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
            retryCount++;
        }
    }
};

export const generateImagesWithNebius = async (imagePrompts) => {
    // For demo purposes, return mock image URLs if API key is not available
    if (!process.env.NEXT_PUBLIC_NEBIUS_API_KEY) {
        console.warn('Nebius API key not found, returning mock images');
        return [
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=720&h=1280&fit=crop",
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=720&h=1280&fit=crop",
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=720&h=1280&fit=crop",
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=720&h=1280&fit=crop"
        ];
    }

    try {
        const images = await Promise.all(
            imagePrompts.map(async (prompt) => {
                const response = await nebiusClient.images.generate({
                    model: "black-forest-labs/flux-schnell",
                    response_format: "url",
                    extra_body: {
                        response_extension: "png",
                        width: 576,
                        height: 1024,
                        num_inference_steps: 5,
                        negative_prompt: "blurry,bad anatomy",
                        seed: -1
                    },
                    prompt: prompt.imagePrompt
                });
                return response.data[0].url;
            })
        );
        return images;
    } catch (error) {
        console.error("Error generating images with Nebius:", error);
        // Return mock images as fallback
        return [
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=720&h=1280&fit=crop",
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=720&h=1280&fit=crop",
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=720&h=1280&fit=crop",
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=720&h=1280&fit=crop"
        ];
    }
};