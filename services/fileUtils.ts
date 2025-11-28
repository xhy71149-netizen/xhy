import { FileWithPreview } from '../types';

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the Data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const createPreview = (file: File): string => {
  return URL.createObjectURL(file);
};

export const revokePreview = (url: string) => {
  URL.revokeObjectURL(url);
};

export const generateVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    
    // Create URL for the video file
    const url = URL.createObjectURL(file);
    video.src = url;

    // Wait for metadata to load to know duration
    video.onloadedmetadata = () => {
      // Seek to 1 second or 50% if shorter than 2s
      if (video.duration < 2) {
        video.currentTime = video.duration / 2;
      } else {
        video.currentTime = 1.0; 
      }
    };

    // Once seeked, draw to canvas
    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to Base64 (Data URL)
        // Default to JPEG with 0.8 quality for reasonable size
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // Clean up
        URL.revokeObjectURL(url);
        
        resolve(dataUrl);
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    video.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(new Error('Error loading video file for thumbnail generation'));
    };
  });
};