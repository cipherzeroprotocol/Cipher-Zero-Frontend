// VideoService.ts

import { ThetaVideoAPIClient } from '@thetalabs/theta-js'; // Corrected import statement
import { videoConfig } from '../config/VideoConfig'; // Corrected typo in import

// Define the TypeScript interfaces for video metadata and upload response
interface VideoMetadata {
  title: string;
  description: string;
  tags?: string[];
  duration: number; // Duration in seconds
  thumbnailUrl?: string;
  [key: string]: any; // For additional metadata fields
}

interface VideoUploadResponse {
  videoId: string;
  uploadUrl: string;
  thumbnailUrl?: string;
  [key: string]: any; // For additional response fields
}

class VideoService {
  private videoAPIClient: ThetaVideoAPIClient;

  constructor() {
    // Initialize Theta Video API client with configuration
    // Corrected to use the imported VideoConfig object
    this.videoAPIClient = new ThetaVideoAPIClient(videoConfig.thetaVideoAPIUrl, videoConfig.apiKey);
  }

  /**
   * Uploads a video to the Theta network.
   * @param filePath - The path to the video file to upload.
   * @param metadata - Metadata to associate with the video.
   * @returns A promise that resolves to the upload response containing video details.
   */
  public async uploadVideo(filePath: string, metadata: VideoMetadata): Promise<VideoUploadResponse> {
    try {
      const response = await this.videoAPIClient.uploadVideo(filePath, metadata);
      return response;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Failed to upload video');
    }
  }

  /**
   * Retrieves video metadata by its ID.
   * @param videoId - The ID of the video.
   * @returns A promise that resolves to the video metadata.
   */
  public async getVideoMetadata(videoId: string): Promise<VideoMetadata> {
    try {
      const metadata = await this.videoAPIClient.getVideoMetadata(videoId);
      return metadata;
    } catch (error) {
      console.error('Error fetching video metadata:', error);
      throw new Error('Failed to fetch video metadata');
    }
  }

  /**
   * Streams a video from the Theta network.
   * @param videoId - The ID of the video to stream.
   * @returns A promise that resolves to the video stream URL.
   */
  public async streamVideo(videoId: string): Promise<string> {
    try {
      const streamUrl = await this.videoAPIClient.getVideoStreamUrl(videoId);
      return streamUrl;
    } catch (error) {
      console.error('Error streaming video:', error);
      throw new Error('Failed to stream video');
    }
  }

  /**
   * Deletes a video from the Theta network.
   * @param videoId - The ID of the video to delete.
   * @returns A promise that resolves when the video is successfully deleted.
   */
  public async deleteVideo(videoId: string): Promise<void> {
    try {
      await this.videoAPIClient.deleteVideo(videoId);
    } catch (error) {
      console.error('Error deleting video:', error);
      throw new Error('Failed to delete video');
    }
  }
}

export default new VideoService();