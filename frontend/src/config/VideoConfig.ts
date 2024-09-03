// VideoConfig.ts

interface VideoConfig {
    thetaVideoAPIUrl: string;
    apiKey: string;
    // Add other configuration options if needed
  }
  
  // Configuration object with default values
  const videoConfig: VideoConfig = {
    thetaVideoAPIUrl: 'https://api.theta.network/video', // Replace with the actual Theta Video API URL
    apiKey: 'YOUR_API_KEY_HERE', // Replace with your actual API key
  };
  
  export { videoConfig };
  