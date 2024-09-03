import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import global styles
import App from './App'; // Main App component
import reportWebVitals from './reportWebVitals'; // Performance metrics
import { BrowserRouter as Router } from 'react-router-dom'; // For routing
import { createStore } from 'redux'; // For state management (if using Redux)
import { Provider } from 'react-redux'; // To provide the store to the app
import rootReducer from './reducers'; // Import your root reducer for Redux

// Create a Redux store (if using Redux)
const store = createStore(rootReducer);

// Root element for rendering
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    <Provider store={store}> {/* Provide Redux store to the app */}
      <Router> {/* Wrap the app with Router for routing */}
        <App />
      </Router>
    </Provider>
  </React.StrictMode>
);

// Measure performance metrics
reportWebVitals(console.log);
