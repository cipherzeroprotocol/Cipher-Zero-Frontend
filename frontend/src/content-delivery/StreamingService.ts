import { videoConfig } from '../config/VideoConfig'; // Adjust the path as necessary
import axios from 'axios';

// Define types for streaming operations
interface StreamRequest {
  videoId: string;
  startTime: number; // Start time in milliseconds
  endTime: number; // End time in milliseconds
}

interface StreamResponse {
  url: string; // URL to the stream
  streamId: string; // Unique identifier for the stream
}

// StreamingService class to manage streaming operations
class StreamingService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = videoConfig.thetaVideoAPIUrl;
    this.apiKey = videoConfig.apiKey;
  }

  // Method to start a new stream
  async startStream(request: StreamRequest): Promise<StreamResponse> {
    try {
      const response = await axios.post(`${this.apiUrl}/start-stream`, request, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to start stream: ${(error as any).message}`);
    }
  }

  // Method to stop a stream
  async stopStream(streamId: string): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/stop-stream`, { streamId }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error: any) {
      throw new Error(`Failed to stop stream: ${error.message}`);
    }
  }

  // Method to get stream information
  async getStreamInfo(streamId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}/stream-info`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        params: { streamId },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get stream info: ${error.message}`);
    }
  }
}

export default new StreamingService();
