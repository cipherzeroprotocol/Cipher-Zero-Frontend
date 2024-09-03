
// user_interface/CurrencySelectionComponent.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Sample currencies list, replace with your actual data source
const CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'BTC', name: 'Bitcoin' },
  // Add more currencies as needed
];

const CurrencySelectionComponent = ({ selectedCurrency, onCurrencyChange }) => {
  const [currencies, setCurrencies] = useState(CURRENCIES);

  useEffect(() => {
    // Optionally, fetch currencies dynamically from an API
    // axios.get('API_ENDPOINT').then(response => setCurrencies(response.data));
  }, []);

  const handleCurrencyChange = (event) => {
    const currencyCode = event.target.value;
    onCurrencyChange(currencyCode);
  };

  return (
    <div>
      <label htmlFor="currency-select">Select Currency:</label>
      <select id="currency-select" value={selectedCurrency} onChange={handleCurrencyChange}>
        {currencies.map(currency => (
          <option key={currency.code} value={currency.code}>
            {currency.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelectionComponent;