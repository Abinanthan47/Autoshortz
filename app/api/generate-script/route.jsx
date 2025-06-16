import { generateScriptAndImages } from "@/configs/AiModel";
import { NextResponse } from "next/server";

const SCRIPT_PROMPT = `Write two different YouTube Shorts scripts, each for a {duration} seconds video on the topic: {topic}.

Make both scripts engaging, with strong hooks in the first few seconds to grab attention.
Keep the content concise, informative, or entertaining based on the topic.
Avoid any scene descriptions or stage directions in the script.
dont use \n in content text just give full plain text
Do not use,/n, braces or any extra formatting—just the plain story text.
For each script, break it down into scenes based on logical flow (e.g., hook, fact, call to action based on the topic ).
For every scene, provide:
Scenecontent: A line or phrase directly from the script (to represent that part).
imagePrompt: A corresponding highly detailed midjpurney accurate ai image generation prompt according to scene content .
🔄 Respond in JSON format only, following this schema:

{
  "scripts": [
    {
      "content": "Script text here",
      "scenes": [
        {
          "Scenecontent": "Scene text here from content",
          "imagePrompt": "Respective, highly detailed image prompt according and accurate to the  scene content"
        }
      ]
    }
  ]
}`;

export async function POST(req) {
  try {
    const { topic, duration = "30" } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    // Validate duration
    const validDurations = ["30", "45", "60"];
    if (!validDurations.includes(duration)) {
      return NextResponse.json(
        { error: "Invalid duration. Must be 30, 45, or 60 seconds" },
        { status: 400 }
      );
    }

    // Replace duration placeholder in prompt
    const prompt = SCRIPT_PROMPT.replace("{duration}", duration).replace("{topic}", topic);

    const result = await generateScriptAndImages(topic, prompt);

    if (!result || typeof result !== 'object' || !result.scripts || !Array.isArray(result.scripts)) {
      return NextResponse.json(
        { error: "Invalid response format from API" },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating script:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to generate script",
        details: error.stack
      },
      { status: 500 }
    );
  }
}