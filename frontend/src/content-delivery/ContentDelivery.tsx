import React, { useState, useEffect } from 'react';
import StreamingService from './StreamingService'; // Adjust the import path as necessary

// Define props for ContentDelivery component
interface ContentDeliveryProps {
  videoId: string;
}

// Define state types for ContentDelivery component
interface StreamInfo {
  url: string;
  streamId: string;
}

const ContentDelivery: React.FC<ContentDeliveryProps> = ({ videoId }) => {
  const [streamInfo, setStreamInfo] = useState<StreamInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to start a stream and fetch stream info
    const startStream = async () => {
      try {
        // Start a new stream
        const response = await StreamingService.startStream({
          videoId,
          startTime: Date.now(),
          endTime: Date.now() + 60000, // Stream for 1 minute
        });
        setStreamInfo({
          url: response.url,
          streamId: response.streamId,
        });

        // Optionally, get additional stream info
        const infoResponse = await StreamingService.getStreamInfo(response.streamId);
        console.log('Stream info:', infoResponse);
      } catch (err) {
        setError(`Failed to start or fetch stream: ${(err as Error).message}`);
      }
    };

    startStream();

    // Cleanup function to stop the stream
    return () => {
      if (streamInfo?.streamId) {
        StreamingService.stopStream(streamInfo.streamId)
          .then(() => console.log('Stream stopped'))
          .catch((err) => console.error('Failed to stop stream:', err.message));
      }
    };
  }, [videoId, streamInfo]);

  return (
    <div>
      {error && <p className="error">{error}</p>}
      {streamInfo ? (
        <div>
          <h2>Video Stream</h2>
          <video
            src={streamInfo.url}
            controls
            autoPlay
            width="800"
            height="450"
            style={{ border: '1px solid #ddd', borderRadius: '8px' }}
          />
          <p>Stream ID: {streamInfo.streamId}</p>
        </div>
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
};

export default ContentDelivery;
