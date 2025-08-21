/**
 * Cloudinary Configuration and Video Processing Functions
 * 
 * This handles all video upload and processing through Cloudinary's powerful
 * transformation APIs instead of using Render's limited 512MB memory.
 */

import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export interface VideoProcessingResult {
  success: boolean;
  downloadUrl?: string;
  publicId?: string;
  error?: string;
  processingTime?: number;
}

export interface ProcessingOptions {
  mode: 'simple' | 'advanced';
  outputFormat?: 'mp4' | 'webm';
  quality?: 'auto' | 'high' | 'medium' | 'low';
}

/**
 * Upload video to Cloudinary with progress tracking
 */
export async function uploadVideoToCloudinary(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ publicId: string; uploadUrl: string }> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'video_processing'); // You'll create this in Cloudinary
    formData.append('resource_type', 'video');
    
    const xhr = new XMLHttpRequest();
    
    // Track upload progress
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const progress = (e.loaded / e.total) * 100;
        onProgress(progress);
      }
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve({
          publicId: response.public_id,
          uploadUrl: response.secure_url
        });
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });
    
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });
    
    const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`;
    xhr.open('POST', cloudinaryUploadUrl);
    xhr.send(formData);
  });
}

/**
 * Process uploaded video using Cloudinary transformations
 */
export async function processVideoWithCloudinary(
  publicId: string,
  options: ProcessingOptions
): Promise<VideoProcessingResult> {
  const startTime = Date.now();
  
  try {
    if (options.mode === 'simple') {
      return await processSimpleVertical(publicId, startTime);
    } else {
      return await processAdvancedSplitScreen(publicId, startTime);
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Processing failed',
      processingTime: Date.now() - startTime
    };
  }
}

/**
 * Simple vertical video conversion
 */
async function processSimpleVertical(publicId: string, startTime: number): Promise<VideoProcessingResult> {
  // Cloudinary transformation for landscape to vertical
  const transformedUrl = cloudinary.url(publicId, {
    resource_type: 'video',
    transformation: [
      { width: 720, height: 1280, crop: 'fill', gravity: 'center' },
      { quality: 'auto', format: 'mp4' },
      { flags: 'progressive' }
    ]
  });
  
  return {
    success: true,
    downloadUrl: transformedUrl,
    publicId,
    processingTime: Date.now() - startTime
  };
}

/**
 * Advanced split-screen processing with Minecraft background
 */
async function processAdvancedSplitScreen(publicId: string, startTime: number): Promise<VideoProcessingResult> {
  // Step 1: Create top half (user video)
  const topHalfUrl = cloudinary.url(publicId, {
    resource_type: 'video',
    transformation: [
      { width: 720, height: 640, crop: 'fill', gravity: 'center' },
      { quality: 'auto' }
    ]
  });
  
  // Step 2: Create bottom half (Minecraft background with subtitles)
  // Note: You'll need to upload minecraft gameplay to Cloudinary first
  const minecraftPublicId = 'minecraft_gameplay_sample'; // Upload this to your Cloudinary
  
  const bottomHalfUrl = cloudinary.url(minecraftPublicId, {
    resource_type: 'video',
    transformation: [
      { width: 720, height: 640, crop: 'fill' },
      { 
        overlay: {
          resource_type: 'subtitles',
          public_id: `${publicId}_subtitles` // Generated from audio transcription
        }
      }
    ]
  });
  
  // Step 3: Combine top and bottom for split-screen effect
  const splitScreenUrl = cloudinary.url(publicId, {
    resource_type: 'video',
    transformation: [
      // First, resize user video to top half
      { width: 720, height: 640, crop: 'fill', gravity: 'center' },
      { flags: 'layer_apply' },
      
      // Then overlay minecraft gameplay on bottom
      {
        overlay: {
          resource_type: 'video',
          public_id: minecraftPublicId
        },
        width: 720,
        height: 640,
        crop: 'fill',
        gravity: 'south'
      },
      
      // Final output settings
      { width: 720, height: 1280, crop: 'fit' },
      { quality: 'auto', format: 'mp4' },
      { flags: 'progressive' }
    ]
  });
  
  return {
    success: true,
    downloadUrl: splitScreenUrl,
    publicId,
    processingTime: Date.now() - startTime
  };
}

/**
 * Generate subtitles using Cloudinary's AI transcription
 */
export async function generateSubtitles(publicId: string): Promise<string> {
  try {
    // Cloudinary AI-powered transcription
    const transcriptionResult = await cloudinary.api.create_archive({
      type: 'upload',
      target_format: 'srt',
      resource_type: 'video',
      public_ids: [publicId],
      transformations: [
        {
          flags: 'speech_recognition'
        }
      ]
    });
    
    return transcriptionResult.secure_url;
  } catch (error) {
    throw new Error('Subtitle generation failed');
  }
}

/**
 * Check processing status for complex transformations
 */
export async function checkProcessingStatus(publicId: string): Promise<'pending' | 'complete' | 'failed'> {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: 'video'
    });
    
    // Check if all transformations are ready
    return result.derived && result.derived.length > 0 ? 'complete' : 'pending';
  } catch (error) {
    return 'failed';
  }
}

export default cloudinary;