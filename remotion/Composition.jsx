import { Composition } from 'remotion';
import RemotionComposition from './../app/_components/RemotionComposition';

// Helper function to calculate duration based on captions
const calculateDurationInFrames = (captions) => {
  if (!Array.isArray(captions) || captions.length === 0) return 900; // Default duration if no captions
  const lastCaption = captions[captions.length - 1];
  const durationInSeconds = lastCaption.end + 2; // Add 2 second buffer
  return Math.ceil(durationInSeconds * 30); // Convert to frames (30fps)
};

export const MyComposition = ({ videoData }) => {
  // Extract caption data from props or use empty array as fallback
  const captionJson = videoData?.videoData?.captionJson || [];

  // Calculate duration in frames
  const durationInFrames = calculateDurationInFrames(captionJson);

  return (
    <>
      <Composition
        id="youtubeShort"
        component={RemotionComposition}
        durationInFrames={durationInFrames}
        fps={30}
        width={720}
        height={1280}
        defaultProps={{
          videoData: {
            captionJson: [],
            images: [],
            caption: { style: '' },
            audioUrl: null
          }
        }}
      />
    </>
  );
};