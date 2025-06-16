"use client"
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, Play, Pause, RotateCcw } from 'lucide-react';
import VideoRenderer from '@/lib/videoRenderer';

const captionStyles = {
  'Youtuber': {
    fontSize: 56,
    color: '#facc15',
    fontFamily: 'Arial Bold',
    strokeColor: '#ef4444',
    strokeWidth: 3
  },
  'Supreme': {
    fontSize: 48,
    color: 'white',
    fontFamily: 'Arial',
    strokeColor: 'black',
    strokeWidth: 2
  },
  'Neon': {
    fontSize: 52,
    color: '#10b981',
    fontFamily: 'Arial Bold',
    strokeColor: '#000000',
    strokeWidth: 2
  },
  'Carbon': {
    fontSize: 56,
    color: 'white',
    fontFamily: 'Arial Bold',
    strokeColor: '#000000',
    strokeWidth: 4
  },
  'Glitch': {
    fontSize: 48,
    color: '#ec4899',
    fontFamily: 'Arial Bold',
    strokeColor: '#000000',
    strokeWidth: 2
  },
  'Fire': {
    fontSize: 52,
    color: '#ef4444',
    fontFamily: 'Arial Bold',
    strokeColor: '#000000',
    strokeWidth: 2
  }
};

function VideoRendererComponent({ videoData, onVideoGenerated }) {
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoBlob, setVideoBlob] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  
  const videoRef = useRef(null);
  const rendererRef = useRef(null);

  const initRenderer = useCallback(async () => {
    if (!rendererRef.current) {
      rendererRef.current = new VideoRenderer();
      rendererRef.current.setProgressCallback(setProgress);
      await rendererRef.current.load();
    }
  }, []);

  const renderVideo = async () => {
    if (!videoData?.images || !videoData?.captionJson) {
      setError('Missing video data. Please ensure images and captions are available.');
      return;
    }

    setIsRendering(true);
    setError(null);
    setProgress(0);

    try {
      await initRenderer();

      const selectedStyle = captionStyles[videoData.caption?.name] || captionStyles['Youtuber'];
      
      // Calculate video duration from captions
      const duration = videoData.captionJson.length > 0 
        ? videoData.captionJson[videoData.captionJson.length - 1].end + 2 
        : 30;

      const options = {
        width: 720,
        height: 1280,
        fps: 30,
        duration: duration,
        captionStyle: selectedStyle,
        transitions: true
      };

      const blob = await rendererRef.current.createVideoFromImages(
        videoData.images,
        videoData.audioUrl,
        videoData.captionJson,
        options
      );

      setVideoBlob(blob);
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      
      if (onVideoGenerated) {
        onVideoGenerated(blob, url);
      }

    } catch (err) {
      console.error('Video rendering failed:', err);
      setError(err.message || 'Video rendering failed');
    } finally {
      setIsRendering(false);
      setProgress(0);
    }
  };

  const downloadVideo = () => {
    if (!videoBlob) return;

    const url = URL.createObjectURL(videoBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoData.title || 'video'}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const togglePlayback = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const resetVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Video Preview */}
      {videoUrl && (
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full max-w-md mx-auto aspect-[9/16] object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            controls={false}
          />
          
          {/* Video Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={togglePlayback}
              className="bg-black/50 hover:bg-black/70 text-white"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={resetVideo}
              className="bg-black/50 hover:bg-black/70 text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Rendering Progress */}
      {isRendering && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Rendering video...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={renderVideo}
          disabled={isRendering || !videoData?.images}
          className="flex-1"
        >
          {isRendering ? 'Rendering...' : 'Generate Video'}
        </Button>
        
        {videoBlob && (
          <Button
            onClick={downloadVideo}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        )}
      </div>

      {/* Video Info */}
      {videoData && (
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Images:</strong> {videoData.images?.length || 0}</p>
          <p><strong>Audio:</strong> {videoData.audioUrl ? 'Available' : 'Not available'}</p>
          <p><strong>Captions:</strong> {videoData.captionJson?.length || 0} words</p>
          <p><strong>Style:</strong> {videoData.caption?.name || 'Default'}</p>
        </div>
      )}
    </div>
  );
}

export default VideoRendererComponent;