import React, { useState, useEffect } from 'react';
import ValidatorService from './ValidatorService';

const GuardianNode: React.FC = () => {
  const [stakingStatus, setStakingStatus] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [stakeAmount, setStakeAmount] = useState<number>(0);

  useEffect(() => {
    if (address) {
      ValidatorService.getStakingStatus(address).then(setStakingStatus);
    }
  }, [address]);

  const handleStake = async () => {
    if (address && stakeAmount > 0) {
      const result = await ValidatorService.stakeTokens(stakeAmount, address);
      alert(result);
    } else {
      alert('Please enter a valid address and stake amount.');
    }
  };

  return (
    <div>
      <h1>Guardian Node</h1>
      <div>
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Stake Amount:
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(Number(e.target.value))}
          />
        </label>
      </div>
      <button onClick={handleStake}>Stake Tokens</button>
      <div>
        <h2>Staking Status</h2>
        <p>{stakingStatus}</p>
      </div>
    </div>
  );
};

export default GuardianNode;
