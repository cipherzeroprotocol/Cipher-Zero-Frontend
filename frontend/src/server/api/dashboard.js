const express = require('express');
const router = express.Router();

// Mock data for dashboard overview
const dashboardData = {
    totalTransactions: 10000,
    activeUsers: 2500,
    totalRewards: 50000,
};

// Mock function to simulate fetching user metrics data
const userMetricsData = (address) => ({
    transactions: 150,
    rewards: 2000,
    computePower: 50,
});

// Endpoint to get dashboard overview data
router.get('/dashboard', (req, res) => {
    try {
        res.json(dashboardData);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// Endpoint to get user metrics by address
router.get('/user-metrics/:address', (req, res) => {
    const { address } = req.params;

    // Validate address format (basic example, adjust as needed)
    if (!address || typeof address !== 'string') {
        return res.status(400).json({ error: 'Invalid address format' });
    }

    try {
        const metrics = userMetricsData(address);
        res.json(metrics);
    } catch (error) {
        console.error(`Error fetching metrics for address ${address}:`, error);
        res.status(500).json({ error: 'Failed to fetch user metrics' });
    }
});

module.exports = router;
