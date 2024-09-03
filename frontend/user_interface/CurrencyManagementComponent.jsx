
// user_interface/CurrencyManagementComponent.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Sample currency data, replace with your actual data source
const SAMPLE_CURRENCY_LIST = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  // Add more currencies as needed
];

const CurrencyManagementComponent = () => {
  const [currencies, setCurrencies] = useState(SAMPLE_CURRENCY_LIST);
  const [newCurrency, setNewCurrency] = useState({ code: '', name: '' });

  const handleAddCurrency = async () => {
    try {
      // Replace with actual API endpoint and currency addition logic
      const response = await axios.post('API_ENDPOINT', newCurrency);
      setCurrencies([...currencies, response.data]);
      setNewCurrency({ code: '', name: '' });
    } catch (error) {
      console.error(`Failed to add currency: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Currency Management</h2>
      <h3>Available Currencies</h3>
      <ul>
        {currencies.map(currency => (
          <li key={currency.code}>{currency.name} ({currency.code})</li>
        ))}
      </ul>
      <h3>Add New Currency</h3>
      <label>
        Code:
        <input
          type="text"
          value={newCurrency.code}
          onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value })}
        />
      </label>
      <label>
        Name:
        <input
          type="text"
          value={newCurrency.name}
          onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
        />
      </label>
      <button onClick={handleAddCurrency}>Add Currency</button>
    </div>
  );
};

export default CurrencyManagementComponent;