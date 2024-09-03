import { Theta } from '@thetalabs/theta-js';
import { useContext } from 'react';
import { ThetaContext } from '../contexts/ThetaContext';

const ThetaService = () => {
  const { provider, userAddress } = useContext(ThetaContext);

  const uploadVideo = async (videoFile) => {
    const response = await provider.uploadVideo(videoFile);
    return response;
  };

  const streamVideo = async (videoId) => {
    const videoUrl = await provider.getVideoUrl(videoId);
    return videoUrl;
  };

  return { uploadVideo, streamVideo };
};

export default ThetaService;
