import SDK from 'sdk'; // Adjust the path according to your project setup
const sdkInstance = new SDK();
// Example React component fetching data
import React, { useEffect, useState } from 'react';

function ContractData() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const sdkInstance = new SDK();
      const result = await sdkInstance.getContractData('contractAddress');
      setData(result);
    }
    fetchData();
  }, []);

  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
}

export default ContractData;
