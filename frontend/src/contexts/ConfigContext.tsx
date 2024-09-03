// src/context/ConfigContext.tsx

import React, { createContext, useContext, ReactNode } from 'react';
import { networkConfigs } from '../config/NetworkConfig'; // Import network configurations

import { contractConfig } from '../config/contractConfig'; // Import contract configurations
import { projectSettings } from '../config/projectSettings'; // Import project settings

// Define the shape of the context state
interface ConfigContextType {
  networkConfigs: typeof networkConfigs;
  
  contractConfig: typeof contractConfig;
  projectSettings: typeof projectSettings;
}

// Create the context
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// Context provider component
export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ConfigContext.Provider value={{ networkConfigs, contractConfig, projectSettings }}>
      {children}
    </ConfigContext.Provider>
  );
};

// Custom hook to use the Config context
export const useConfigContext = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfigContext must be used within a ConfigProvider');
  }
  return context;
};
