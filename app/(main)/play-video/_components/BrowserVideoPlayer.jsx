"use client"
import { useState, useEffect } from 'react';
import VideoRendererComponent from '@/app/_components/VideoRenderer';

function BrowserVideoPlayer({ videoData }) {
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState(null);

  const handleVideoGenerated = (blob, url) => {
    setGeneratedVideoUrl(url);
  };

  // Clean up URL when component unmounts
  useEffect(() => {
    return () => {
      if (generatedVideoUrl) {
        URL.revokeObjectURL(generatedVideoUrl);
      }
    };
  }, [generatedVideoUrl]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Browser Video Renderer</h3>
      <p className="text-sm text-gray-600">
        Generate your video directly in the browser using FFmpeg WASM
      </p>
      
      <VideoRendererComponent 
        videoData={videoData} 
        onVideoGenerated={handleVideoGenerated}
      />
    </div>
  );
}

export default BrowserVideoPlayer;