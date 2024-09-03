// src/config/projectSettings.ts

// Define a type for general project settings
export interface ProjectSettings {
    environment: 'development' | 'staging' | 'production';
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  }
  
  // General project settings
  export const projectSettings: ProjectSettings = {
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    logLevel: (process.env.LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
  };
  
  // Export types for use in other files
 
  