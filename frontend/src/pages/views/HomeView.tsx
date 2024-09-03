import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GalleryView from './GalleryView'; // Import the GalleryView component
import './homeview.css'; // Import your CSS file for styling

// Define the type for featured items
interface FeaturedItem {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

// Define the props for HomeView component
interface HomeViewProps {
  galleryApiUrl: string; // URL to fetch gallery items
  featuredApiUrl: string; // URL to fetch featured items
}

const HomeView: React.FC<HomeViewProps> = ({ galleryApiUrl, featuredApiUrl }) => {
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState<boolean>(true);
  const [errorFeatured, setErrorFeatured] = useState<string | null>(null);

  useEffect(() => {
    // Fetch featured items from the API
    const fetchFeaturedItems = async () => {
      try {
        const response = await axios.get(featuredApiUrl);
        setFeaturedItems(response.data);
      } catch (err) {
        setErrorFeatured('Failed to load featured items');
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeaturedItems();
  }, [featuredApiUrl]);

  return (
    <div className="homeview-container">
      <header className="homeview-hero">
        <h1>Welcome to Our Platform</h1>
        <p>Your gateway to exploring amazing features and content.</p>
        <button className="homeview-cta-button">Get Started</button>
      </header>

      <section className="homeview-featured">
        <h2>Featured Items</h2>
        {loadingFeatured ? (
          <div className="homeview-loading">Loading featured items...</div>
        ) : errorFeatured ? (
          <div className="homeview-error">{errorFeatured}</div>
        ) : featuredItems.length === 0 ? (
          <div className="homeview-empty">No featured items available</div>
        ) : (
          <div className="homeview-featured-grid">
            {featuredItems.map(item => (
              <div key={item.id} className="homeview-featured-item">
                <img src={item.imageUrl} alt={item.title} className="homeview-featured-image" />
                <div className="homeview-featured-info">
                  <h3 className="homeview-featured-title">{item.title}</h3>
                  <p className="homeview-featured-description">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="homeview-gallery">
        <h2>Explore Our Gallery</h2>
        <GalleryView apiUrl={galleryApiUrl} />
      </section>
    </div>
  );
};

export default HomeView;
