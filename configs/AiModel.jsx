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
                throw new Error(`Failed to generate script after ${MAX_RETRIES + 1} attempts: ${error.message}`);
            }

            // Wait with exponential backoff before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
            retryCount++;
        }
    }
};

export const generateImagesWithNebius = async (imagePrompts) => {
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
        throw new Error(`Failed to generate images: ${error.message}`);
    }
};
