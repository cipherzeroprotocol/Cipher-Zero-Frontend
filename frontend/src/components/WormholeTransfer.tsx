import React, { useState } from 'react';
import { Button, CircularProgress, TextField, Typography, Paper, Grid } from '@mui/material';

interface WormholeTransferProps {
  wormholeBridgeContract: {
    methods: {
      transfer: (amount: string, recipient: string, nonce: number) => {
        send: () => Promise<void>;
      };
    };
  };
}

const WormholeTransfer: React.FC<WormholeTransferProps> = ({ wormholeBridgeContract }) => {
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [nonce, setNonce] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleTransfer = async () => {
    if (!amount || !recipient || nonce < 0) {
      setError('Please fill in all fields correctly.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await wormholeBridgeContract.methods.transfer(amount, recipient, nonce).send();
      setSuccess('Transfer successful!');
    } catch (err) {
      setError('Transfer failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Wormhole Transfer
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            type="number"
            label="Amount"
            variant="outlined"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={!!error}
            helperText={error ? 'Please enter a valid amount' : ''}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            type="text"
            label="Recipient"
            variant="outlined"
            fullWidth
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            error={!!error}
            helperText={error ? 'Please enter a valid recipient address' : ''}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            type="number"
            label="Nonce"
            variant="outlined"
            fullWidth
            value={nonce}
            onChange={(e) => setNonce(Number(e.target.value))}
            error={nonce < 0}
            helperText={nonce < 0 ? 'Nonce must be a positive number' : ''}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleTransfer}
            disabled={loading}
            fullWidth
            startIcon={loading ? <CircularProgress size={24} /> : null}
          >
            {loading ? 'Processing...' : 'Transfer'}
          </Button>
        </Grid>
      </Grid>
      {success && (
        <Typography color="primary" style={{ marginTop: '20px' }}>
          {success}
        </Typography>
      )}
      {error && (
        <Typography color="error" style={{ marginTop: '20px' }}>
          {error}
        </Typography>
      )}
    </Paper>
  );
};

export default WormholeTransfer;
