import React, { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface VideoPlaybackProps {
    videoUrl: string;  // URL of the video to be played
    poster?: string;   // Optional poster image URL
    metadata?: {
        title?: string;
        description?: string;
    };  // Optional metadata for the video
}

const VideoPlayback: React.FC<VideoPlaybackProps> = ({ videoUrl, poster, metadata }) => {
    const videoRef = useRef<HTMLDivElement | null>(null);
    const playerRef = useRef<typeof videojs.players | null>(null);

    useEffect(() => {
        if (videoRef.current && !playerRef.current) {
            // Initialize video.js player
            const videoElement = document.createElement('video');
            videoElement.className = 'video-js vjs-default-skin';
            videoRef.current.appendChild(videoElement);

            const player = playerRef.current = videojs(videoElement, {
                controls: true,
                autoplay: false,
                preload: 'auto',
                sources: [{ src: videoUrl, type: 'video/mp4' }],
                poster: poster,
            });

            player.on('ready', () => {
                videojs.log('Player is ready');
            });

            return () => {
                if (player && !player.isDisposed()) {
                    player.dispose();
                }
            };
        }
    }, [videoUrl, poster]);

    return (
        <div className="video-container">
            <div ref={videoRef} data-vjs-player />
            {metadata && (
                <div className="video-metadata">
                    {metadata.title && <h2>{metadata.title}</h2>}
                    {metadata.description && <p>{metadata.description}</p>}
                </div>
            )}
            <style>{`
                .video-container {
                    position: relative;
                    max-width: 100%;
                    margin: auto;
                }

                .video-metadata {
                    margin-top: 10px;
                    text-align: center;
                }

                .video-metadata h2 {
                    margin: 0;
                    font-size: 1.5rem;
                }

                .video-metadata p {
                    margin: 5px 0 0;
                    font-size: 1rem;
                }
            `}</style>
        </div>
    );
};

export default VideoPlayback;
