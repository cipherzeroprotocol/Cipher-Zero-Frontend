import axios, { AxiosInstance } from 'axios';

// Define types for video metadata, resolutions, DRM collections, and response structures
export interface VideoMetadata {
    name: string;
    description: string;
    resolution: string[];
    drmCollections: { id: string, type: string }[];
}

export interface TranscodingStatus {
    status: string;
    progress: number;
}

export interface VideoUploadResponse {
    videoId: string;
    uploadUrl: string;
}

export interface VideoMetadataResponse {
    metadata: VideoMetadata;
}

export interface VideoListResponse {
    videos: VideoMetadata[];
}

export interface ErrorResponse {
    error: string;
}

export class VideoApiService {
    private apiClient: AxiosInstance;

    constructor(baseURL: string) {
        this.apiClient = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    // Method to upload a video
    async uploadVideo(file: File, metadata: VideoMetadata): Promise<VideoUploadResponse> {
        try {
            // Assuming the API provides a presigned URL for direct upload
            const { data } = await this.apiClient.post<VideoUploadResponse>('/videos/upload', metadata);
            const { videoId, uploadUrl } = data;

            // Perform file upload to the obtained upload URL
            await axios.put(uploadUrl, file, {
                headers: {
                    'Content-Type': file.type,
                },
            });

            return data;
        } catch (error) {
            console.error('Error uploading video:', error);
            throw this.handleError(error);
        }
    }

    // Method to get video metadata
    async getVideoMetadata(videoId: string): Promise<VideoMetadataResponse> {
        try {
            const { data } = await this.apiClient.get<VideoMetadataResponse>(`/videos/${videoId}/metadata`);
            return data;
        } catch (error) {
            console.error('Error fetching video metadata:', error);
            throw this.handleError(error);
        }
    }

    // Method to list all videos
    async listVideos(): Promise<VideoListResponse> {
        try {
            const { data } = await this.apiClient.get<VideoListResponse>('/videos');
            return data;
        } catch (error) {
            console.error('Error listing videos:', error);
            throw this.handleError(error);
        }
    }

    // Method to start transcoding a video
    async startTranscoding(videoId: string): Promise<void> {
        try {
            await this.apiClient.post(`/videos/${videoId}/transcode`);
        } catch (error) {
            console.error('Error starting transcoding:', error);
            throw this.handleError(error);
        }
    }

    // Method to get the status of a transcoding job
    async getTranscodingStatus(videoId: string): Promise<TranscodingStatus> {
        try {
            const { data } = await this.apiClient.get<TranscodingStatus>(`/videos/${videoId}/transcode/status`);
            return data;
        } catch (error) {
            console.error('Error fetching transcoding status:', error);
            throw this.handleError(error);
        }
    }

    // Error handling method
    private handleError(error: any): ErrorResponse {
        // Assuming error.response.data contains an error message
        if (error.response && error.response.data && error.response.data.error) {
            return { error: error.response.data.error };
        }
        return { error: 'An unknown error occurred' };
    }
}
