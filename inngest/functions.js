import {
  generateImagesWithNebius,
  generateScriptAndImages,
} from "@/configs/AiModel";
import { api } from "@/convex/_generated/api";
import { createClient } from "@deepgram/sdk";
import axios from "axios";
import { ConvexHttpClient } from "convex/browser";
import { inngest } from "./client";

const BASE_URL = "https://aigurulab.tech";

export const GenerateVideoData = inngest.createFunction(
  { id: "generate-video-data" },
  { event: "generate-video-data" },
  async ({ event, step }) => {
    try {
      const { topic, title, caption, VideoStyle, voice, recordId } =
        event?.data || {};
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

      if (!topic || !title || !caption || !VideoStyle || !voice || !recordId) {
        throw new Error("Missing required parameters");
      }

      // Generate script and image prompts
      const scriptAndPrompts = await step.run(
        "generateScriptAndPrompts",
        async () => {
          try {
            const result = await generateScriptAndImages(topic);
            if (!result || !result.scripts || !Array.isArray(result.scripts)) {
              throw new Error("Invalid response format from script generation");
            }
            return result;
          } catch (error) {
            console.error("Error generating script and prompts:", error);
            throw new Error(
              `Failed to generate script and prompts: ${error.message}`
            );
          }
        }
      );

      const GenerateAudioFile = await step.run(
        "GenerateAudioFile",
        async () => {
          try {
            const scriptContent = scriptAndPrompts.scripts[0]?.content;
            if (!scriptContent) {
              throw new Error(
                "No script content available for audio generation"
              );
            }

            const result = await axios.post(
              BASE_URL + "/api/text-to-speech",
              {
                input: scriptContent,
                voice: voice,
              },
              {
                headers: {
                  "x-api-key": process.env.NEXT_PUBLIC_AIVOICE_API_KEY,
                  "Content-Type": "application/json",
                },
              }
            );
            if (!result?.data?.audio) {
              throw new Error("No audio URL received from API");
            }
            return result.data.audio;
          } catch (error) {
            console.error("Error generating audio:", error);
            throw new Error(`Failed to generate audio: ${error.message}`);
          }
        }
      );

      const GenerateCaptions = await step.run("generateCaptions", async () => {
        try {
          const deepgram = createClient(
            process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY
          );
          const { result, error } =
            await deepgram.listen.prerecorded.transcribeUrl(
              {
                url: GenerateAudioFile,
              },
              {
                model: "nova-3",
              }
            );

          if (error) {
            throw new Error(`Deepgram error: ${error.message}`);
          }

          if (!result?.results?.channels?.[0]?.alternatives?.[0]?.words) {
            throw new Error(
              "No transcription words found in Deepgram response"
            );
          }

          return result.results.channels[0].alternatives[0].words;
        } catch (error) {
          console.error("Error generating captions:", error);
          throw new Error(`Failed to generate captions: ${error.message}`);
        }
      });

      const GenerateImages = await step.run("generateImages", async () => {
        try {
          const scenes = scriptAndPrompts.scripts[0]?.scenes;
          if (!Array.isArray(scenes) || scenes.length === 0) {
            throw new Error("No valid scenes available for image generation");
          }

          const images = await generateImagesWithNebius(scenes);
          if (!Array.isArray(images) || images.length === 0) {
            throw new Error("No images generated");
          }
          return images;
        } catch (error) {
          console.error("Error in image generation step:", error);
          throw new Error(`Failed in image generation step: ${error.message}`);
        }
      });

      // Update the video record with generated data (no video rendering here)
      await convex.mutation(api.videoData.UpdateVideoRecord, {
        recordId: event.data.recordId,
        audioUrl: GenerateAudioFile,
        captionJson: GenerateCaptions,
        images: GenerateImages,
        downloadUrl: null, // No download URL since we're using browser rendering
      });

      return { 
        audioUrl: GenerateAudioFile,
        captionJson: GenerateCaptions,
        images: GenerateImages,
        message: "Video data generated successfully. Use browser renderer to create video."
      };
    } catch (error) {
      console.error("Error in GenerateVideoData function:", error);
      throw new Error(error.message || "An unknown error occurred");
    }
  }
);