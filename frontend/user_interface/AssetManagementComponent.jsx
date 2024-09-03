// user_interface/AssetManagementComponent.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Sample asset data, replace with your actual data source
const SAMPLE_ASSETS = [
  { id: 1, name: 'Asset 1', value: '100' },
  { id: 2, name: 'Asset 2', value: '200' },
  // Add more assets as needed
];

const AssetManagementComponent = () => {
  const [assets, setAssets] = useState(SAMPLE_ASSETS);
  const [editingAsset, setEditingAsset] = useState(null);

  useEffect(() => {
    // Optionally, fetch assets dynamically from an API
    // axios.get('API_ENDPOINT').then(response => setAssets(response.data));
  }, []);

  const handleEdit = (asset) => {
    setEditingAsset(asset);
  };

  const handleSave = (updatedAsset) => {
    setAssets(assets.map(asset => (asset.id === updatedAsset.id ? updatedAsset : asset)));
    setEditingAsset(null);
  };

  const handleChange = (e) => {
    setEditingAsset({
      ...editingAsset,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h2>Asset Management</h2>
      {editingAsset ? (
        <div>
          <h3>Edit Asset</h3>
          <input
            type="text"
            name="name"
            value={editingAsset.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="value"
            value={editingAsset.value}
            onChange={handleChange}
          />
          <button onClick={() => handleSave(editingAsset)}>Save</button>
          <button onClick={() => setEditingAsset(null)}>Cancel</button>
        </div>
      ) : (
        <div>
          {assets.map(asset => (
            <div key={asset.id}>
              <span>{asset.name} - ${asset.value}</span>
              <button onClick={() => handleEdit(asset)}>Edit</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetManagementComponent;
