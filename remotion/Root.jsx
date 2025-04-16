import { Composition } from 'remotion';
import RemotionComposition from './../app/_components/RemotionComposition';

// Sample data for development/testing
const videoData = {
  audioUrl: '',
  captionJson: [],
  images: ['https://images.unsplash.com/photo-1740940349301-d29d8c62e0f4?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
  caption: {
    name: 'Youtuber',
    style: 'text-yellow-400 text-5xl font-bold [text-shadow:_2px_2px_0_#ef4444] tracking-wide drop-shadow-md px-3 py-1'
  }
};

// Helper function to calculate duration based on captions
const calculateDuration = (captions, fps = 30) => {
  if (!captions || captions.length === 0) return 300; // Default 10 seconds if no captions
  const lastCaption = captions[captions.length - 1];
  // Add 2 seconds buffer to the end
  return Math.ceil((lastCaption.end + 2) * fps);
};

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="youtubeShort"
        component={RemotionComposition}
        durationInFrames={900}
        fps={30}
        width={720}
        height={1280}
        defaultProps={{ videoData }}
      />
    </>
  );
};