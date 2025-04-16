
import {
  generateImagesWithNebius,
  generateScriptAndImages,
} from "@/configs/AiModel";
import { api } from "@/convex/_generated/api";
import { createClient } from "@deepgram/sdk";
import {
  getFunctions,
  getRenderProgress,
  renderMediaOnLambda,
} from "@remotion/lambda-client";
import axios from "axios";
import { ConvexHttpClient } from "convex/browser";
import { inngest } from "./client";

const calculateDurationInFrames = (captions) => {
  if (!Array.isArray(captions) || captions.length === 0) return 900; // Default duration if no captions
  const lastCaption = captions[captions.length - 1];
  if (!lastCaption || typeof lastCaption.end !== "number") return 900;
  const durationInSeconds = lastCaption.end + 2; // Add 2 second buffer
  return Math.ceil(durationInSeconds * 30); // Convert to frames (30fps)
};

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

      const RenderVideo = await step.run("renderVideo", async () => {
        try {
          const functions = await getFunctions({
            region: "us-east-1",
            compatibleOnly: true,
          });

          if (!functions?.length) {
            throw new Error("No compatible Remotion Lambda functions found");
          }

          const totalFrames = calculateDurationInFrames(GenerateCaptions);

          console.log("Render configuration:", {
            totalFrames,
            captionsLength: GenerateCaptions?.length,
            lastCaptionEnd:
              GenerateCaptions?.[GenerateCaptions.length - 1]?.end,
          });

          const framesPerLambda = Math.max(Math.ceil(totalFrames / 150), 20);

          const { renderId, bucketName } = await renderMediaOnLambda({
            region: "us-east-1",
            functionName: functions[0].functionName,
            serveUrl: process.env.AWS_SERVE_URL,
            composition: "youtubeShort",
            inputProps: {
              videoData: {
                audioUrl: GenerateAudioFile,
                captionJson: GenerateCaptions,
                images: GenerateImages,
                caption: {
                  name: caption.name,
                  style: caption.style,
                },
              },
            },
            codec: "h264",
            imageFormat: "jpeg",
            maxRetries: 3,
            framesPerLambda,
            privacy: "public",
            timeoutInMilliseconds: 900000,
            concurrency: 100,
            durationInFrames: totalFrames,
            fps: 30,
          });

          // Monitor render progress
          let outputUrl = null;
          let attempts = 0;
          const maxAttempts = 180;
          const pollInterval = 2000;

          while (attempts < maxAttempts) {
            const progress = await getRenderProgress({
              renderId,
              bucketName,
              functionName: functions[0].functionName,
              region: "us-east-1",
            });

            console.log("Render progress:", {
              attempt: attempts + 1,
              done: progress.done,
              errors: progress.errors,
              fatalError: progress.fatalErrorEncountered,
            });

            if (progress.done) {
              outputUrl = progress.outputFile;
              break;
            }

            if (progress.fatalErrorEncountered) {
              let errorMessage = "Unknown render error";

              if (
                Array.isArray(progress.errors) &&
                progress.errors.length > 0
              ) {
                errorMessage = progress.errors
                  .map((err) => {
                    if (typeof err === "string") return err;
                    if (err instanceof Error) return err.message;
                    if (err && typeof err === "object") {
                      return JSON.stringify(
                        err,
                        Object.getOwnPropertyNames(err)
                      );
                    }
                    return String(err);
                  })
                  .join(", ");
              } else if (
                progress.errors &&
                typeof progress.errors === "object"
              ) {
                errorMessage = JSON.stringify(
                  progress.errors,
                  Object.getOwnPropertyNames(progress.errors)
                );
              }

              console.error("Render fatal error details:", {
                errorMessage,
                renderId,
                bucketName,
                functionName: functions[0].functionName,
              });

              throw new Error(`Render failed: ${errorMessage}`);
            }

            await new Promise((resolve) => setTimeout(resolve, pollInterval));
            attempts++;
          }

          if (!outputUrl) {
            throw new Error(
              "Render timed out after " +
                (maxAttempts * pollInterval) / 1000 +
                " seconds"
            );
          }

          await convex.mutation(api.videoData.UpdateVideoRecord, {
            recordId: event.data.recordId,
            audioUrl: GenerateAudioFile,
            captionJson: GenerateCaptions,
            images: GenerateImages,
            downloadUrl: outputUrl,
          });

          return outputUrl;
        } catch (error) {
          console.error("Render error:", {
            message: error.message,
            stack: error.stack,
            captionsLength: GenerateCaptions?.length,
            lastCaptionEnd:
              GenerateCaptions?.[GenerateCaptions.length - 1]?.end,
          });
          throw new Error(`Render failed: ${error.message}`);
        }
      });

      return { downloadUrl: RenderVideo };
    } catch (error) {
      console.error("Error in GenerateVideoData function:", error);
      throw new Error(error.message || "An unknown error occurred");
    }
  }
);
