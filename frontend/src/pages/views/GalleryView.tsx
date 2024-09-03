import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './gallerview.css'; // Import your CSS file for styling

// Define the type for gallery item
interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

// Define the props for GalleryView component
interface GalleryViewProps {
  apiUrl: string; // URL to fetch gallery items
}

const GalleryView: React.FC<GalleryViewProps> = ({ apiUrl }) => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch gallery items from the API
    const fetchItems = async () => {
      try {
        const response = await axios.get(apiUrl);
        setItems(response.data);
      } catch (err) {
        setError('Failed to load gallery items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [apiUrl]);

  if (loading) return <div className="gallery-loading">Loading...</div>;
  if (error) return <div className="gallery-error">{error}</div>;

  return (
    <div className="gallery-container">
      {items.length === 0 ? (
        <div className="gallery-empty">No items available</div>
      ) : (
        <div className="gallery-grid">
          {items.map(item => (
            <div key={item.id} className="gallery-item">
              <img src={item.imageUrl} alt={item.title} className="gallery-item-image" />
              <div className="gallery-item-info">
                <h3 className="gallery-item-title">{item.title}</h3>
                <p className="gallery-item-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryView;
