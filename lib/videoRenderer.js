import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

class VideoRenderer {
  constructor() {
    this.ffmpeg = new FFmpeg();
    this.loaded = false;
    this.onProgress = null;
  }

  async load() {
    if (this.loaded) return;

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    
    await this.ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    this.loaded = true;
  }

  setProgressCallback(callback) {
    this.onProgress = callback;
    this.ffmpeg.on('progress', ({ progress }) => {
      if (this.onProgress) {
        this.onProgress(Math.round(progress * 100));
      }
    });
  }

  async createVideoFromImages(images, audioUrl, captions, options = {}) {
    if (!this.loaded) await this.load();

    const {
      width = 720,
      height = 1280,
      fps = 30,
      duration = 30,
      captionStyle = {},
      transitions = true
    } = options;

    try {
      // Download and write images
      for (let i = 0; i < images.length; i++) {
        const imageData = await fetchFile(images[i]);
        await this.ffmpeg.writeFile(`image${i}.jpg`, imageData);
      }

      // Download and write audio if provided
      if (audioUrl) {
        const audioData = await fetchFile(audioUrl);
        await this.ffmpeg.writeFile('audio.mp3', audioData);
      }

      // Create image sequence with transitions
      const imageDuration = duration / images.length;
      const transitionDuration = transitions ? 0.5 : 0;

      // Generate filter complex for smooth transitions and effects
      let filterComplex = '';
      let inputs = '';

      for (let i = 0; i < images.length; i++) {
        inputs += `-loop 1 -t ${imageDuration + transitionDuration} -i image${i}.jpg `;
        
        // Scale and add effects to each image
        filterComplex += `[${i}:v]scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height},`;
        
        // Add zoom and pan effects
        const zoomFactor = 1.1;
        filterComplex += `zoompan=z='min(zoom+0.0015,${zoomFactor})':d=${Math.round((imageDuration + transitionDuration) * fps)}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${width}x${height}[v${i}];`;
      }

      // Create crossfade transitions between images
      if (transitions && images.length > 1) {
        let transitionFilter = '[v0]';
        for (let i = 1; i < images.length; i++) {
          const offset = i * imageDuration - transitionDuration;
          transitionFilter += `[v${i}]xfade=transition=fade:duration=${transitionDuration}:offset=${offset}`;
          if (i < images.length - 1) {
            transitionFilter += `[vt${i}];[vt${i}]`;
          }
        }
        filterComplex += transitionFilter + '[video];';
      } else {
        filterComplex += `[v0][video];`;
      }

      // Add captions overlay if provided
      if (captions && captions.length > 0) {
        filterComplex += this.generateCaptionFilter(captions, captionStyle, width, height);
      }

      // Build FFmpeg command
      let command = [
        ...inputs.trim().split(' '),
        '-filter_complex', filterComplex.slice(0, -1), // Remove last semicolon
        '-map', '[video]'
      ];

      // Add audio if provided
      if (audioUrl) {
        command.push('-i', 'audio.mp3', '-map', '1:a', '-c:a', 'aac', '-shortest');
      }

      // Output settings
      command.push(
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-r', fps.toString(),
        '-t', duration.toString(),
        'output.mp4'
      );

      // Execute FFmpeg command
      await this.ffmpeg.exec(command);

      // Read the output file
      const data = await this.ffmpeg.readFile('output.mp4');
      
      // Clean up temporary files
      await this.cleanup(images.length, audioUrl);

      return new Blob([data.buffer], { type: 'video/mp4' });

    } catch (error) {
      console.error('Video rendering error:', error);
      throw new Error(`Video rendering failed: ${error.message}`);
    }
  }

  generateCaptionFilter(captions, style, width, height) {
    let captionFilter = '';
    const fontSize = style.fontSize || 48;
    const fontColor = style.color || 'white';
    const fontFamily = style.fontFamily || 'Arial';
    const strokeColor = style.strokeColor || 'black';
    const strokeWidth = style.strokeWidth || 2;

    for (let i = 0; i < captions.length; i++) {
      const caption = captions[i];
      const startTime = caption.start;
      const endTime = caption.end;
      const text = caption.word.replace(/'/g, "\\'").replace(/"/g, '\\"');

      captionFilter += `drawtext=text='${text}':fontfile=/System/Library/Fonts/Arial.ttf:fontsize=${fontSize}:fontcolor=${fontColor}:borderw=${strokeWidth}:bordercolor=${strokeColor}:x=(w-text_w)/2:y=h-th-50:enable='between(t,${startTime},${endTime})':`;
    }

    return `[video]${captionFilter.slice(0, -1)}[video_with_captions];`;
  }

  async cleanup(imageCount, hasAudio) {
    try {
      // Remove temporary files
      for (let i = 0; i < imageCount; i++) {
        await this.ffmpeg.deleteFile(`image${i}.jpg`);
      }
      if (hasAudio) {
        await this.ffmpeg.deleteFile('audio.mp3');
      }
      await this.ffmpeg.deleteFile('output.mp4');
    } catch (error) {
      console.warn('Cleanup warning:', error);
    }
  }

  async createSlideshow(images, options = {}) {
    const {
      duration = 3,
      transition = 'fade',
      width = 720,
      height = 1280
    } = options;

    if (!this.loaded) await this.load();

    try {
      // Write images
      for (let i = 0; i < images.length; i++) {
        const imageData = await fetchFile(images[i]);
        await this.ffmpeg.writeFile(`slide${i}.jpg`, imageData);
      }

      // Create slideshow with transitions
      let filterComplex = '';
      let inputs = '';

      for (let i = 0; i < images.length; i++) {
        inputs += `-loop 1 -t ${duration} -i slide${i}.jpg `;
        filterComplex += `[${i}:v]scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height}[v${i}];`;
      }

      // Add transitions
      if (images.length > 1) {
        let transitionChain = '[v0]';
        for (let i = 1; i < images.length; i++) {
          transitionChain += `[v${i}]xfade=transition=${transition}:duration=0.5:offset=${(i * duration) - 0.5}`;
          if (i < images.length - 1) {
            transitionChain += `[t${i}];[t${i}]`;
          }
        }
        filterComplex += transitionChain + '[output]';
      } else {
        filterComplex += '[v0][output]';
      }

      await this.ffmpeg.exec([
        ...inputs.trim().split(' '),
        '-filter_complex', filterComplex,
        '-map', '[output]',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-r', '30',
        'slideshow.mp4'
      ]);

      const data = await this.ffmpeg.readFile('slideshow.mp4');
      
      // Cleanup
      for (let i = 0; i < images.length; i++) {
        await this.ffmpeg.deleteFile(`slide${i}.jpg`);
      }
      await this.ffmpeg.deleteFile('slideshow.mp4');

      return new Blob([data.buffer], { type: 'video/mp4' });

    } catch (error) {
      console.error('Slideshow creation error:', error);
      throw new Error(`Slideshow creation failed: ${error.message}`);
    }
  }
}

export default VideoRenderer;