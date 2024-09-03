import React, { FC, useState, useEffect, ReactNode } from 'react';
import { useDeliveryContext, DeliveryProvider } from '../contexts/DeliveryContext';
import { Button, Notification } from '../components/UIComponents'; // Assuming you have a UI component library
import { fetchDeliveryDetails } from '../services/deliveryService'; // Example service to fetch delivery details
import { ErrorBoundary } from './ErrorBoundary'; // Import the ErrorBoundary component


// Define the Delivery component
const Delivery = () => {
  const [deliveryDetails, setDeliveryDetails] = useState<any>(null); // Replace `any` with a more specific type
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { state, dispatch } = useDeliveryContext(); // Example of using context

  useEffect(() => {
    const loadDeliveryDetails = async () => {
      try {
        const details = await fetchDeliveryDetails();
        setDeliveryDetails(details);
      } catch (err) {
        setError('Failed to load delivery details');
      } finally {
        setLoading(false);
      }
    };

    loadDeliveryDetails();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <Notification type="error" message={error} />;

  return (
    <div>
      <h1>Delivery Page</h1>
      {deliveryDetails ? (
        <div>
          {/* Render delivery details */}
          <pre>{JSON.stringify(deliveryDetails, null, 2)}</pre>
        </div>
      ) : (
        <p>No delivery details available.</p>
      )}
      <Button onClick={() => dispatch({ type: 'REFRESH_DELIVERY' })}>Refresh Delivery Info</Button>
    </div>
  );
};

// Wrap with ErrorBoundary to catch errors in this component tree
const DeliveryPage = () => (
  <ErrorBoundary>
    <Delivery />
  </ErrorBoundary>
);

export default DeliveryPage;
