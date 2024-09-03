import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Define the shape of the delivery state
interface DeliveryState {
  deliveryDetails: any; // Replace `any` with a more specific type based on your data structure
  loading: boolean;
  error: string | null;
}

// Define action types
type DeliveryAction =
  | { type: 'SET_DELIVERY_DETAILS'; payload: any } // Replace `any` with specific type
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: DeliveryState = {
  deliveryDetails: null,
  loading: false,
  error: null,
};

// Create a context
const DeliveryContext = createContext<{
  state: DeliveryState;
  dispatch: React.Dispatch<DeliveryAction>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

// Define a reducer function
const deliveryReducer = (state: DeliveryState, action: DeliveryAction): DeliveryState => {
  switch (action.type) {
    case 'SET_DELIVERY_DETAILS':
      return { ...state, deliveryDetails: action.payload, loading: false, error: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};

// Create a provider component
export const DeliveryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(deliveryReducer, initialState);

  return (
    <DeliveryContext.Provider value={{ state, dispatch }}>
      {children}
    </DeliveryContext.Provider>
  );
};

// Custom hook to use the delivery context
export const useDeliveryContext = () => useContext(DeliveryContext);
