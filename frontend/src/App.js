import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './redux/reducers';
import { fetchUserMetrics } from './redux/actions/userActions';

// Importing views
import HomeView from './views/homeview';
import GalleryView from './views/gallerview';
import TokenBridgeView from './views/tokenbridgeview';
import DashboardView from './views/dashboardview';

// Importing components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

// Importing global styles
import './styles/global.css';
import './styles/components.css';

// Creating Redux store with middleware
const store = createStore(rootReducer, applyMiddleware(thunk));
import { uploadFile } from './apiHelper';

function App() {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    try {
      const response = await uploadFile(file);
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  return (
    <div className="App">
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
}
const App = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch initial data if necessary
    const loadInitialData = async () => {
      try {
        await store.dispatch(fetchUserMetrics());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  if (loading) {
    return <div className="App-loading">Loading...</div>;
  }

  if (error) {
    return <div className="App-error">Error: {error}</div>;
  }

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Sidebar />
          <main className="App-main">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/gallery" element={<GalleryView />} />
              <Route path="/tokenbridge" element={<TokenBridgeView />} />
              <Route path="/dashboard" element={<DashboardView />} />
              {/* Add more routes here as needed */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
};

export default App;
