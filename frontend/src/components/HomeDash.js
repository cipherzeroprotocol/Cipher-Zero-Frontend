import React, { useState, useEffect } from 'react';
import { useThetaProvider, useThetaContract } from '../../contexts/ThetaContext'; // Custom hooks for Theta integration
import { fetchDashboardData, fetchUserMetrics } from '../../api/dashboard'; // API calls
import { Card, Col, Row, Spinner, Alert } from 'react-bootstrap'; // Using react-bootstrap for UI components

const HomeDash = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [userMetrics, setUserMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const thetaProvider = useThetaProvider();
    const thetaContract = useThetaContract();

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await fetchDashboardData(); // Fetching data from the API
                setDashboardData(data);

                // Optionally, fetch user metrics if a user is logged in
                if (thetaProvider) {
                    const metrics = await fetchUserMetrics(thetaProvider.address); // Fetch metrics using Theta provider
                    setUserMetrics(metrics);
                }
            } catch (err) {
                setError('Failed to load data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [thetaProvider]);

    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border" />
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center">
                <Alert variant="danger">{error}</Alert>
            </div>
        );
    }

    return (
        <div className="home-dash">
            <h1>Home Dashboard</h1>
            <Row>
                <Col md={6}>
                    <Card>
                        <Card.Header>Network Metrics</Card.Header>
                        <Card.Body>
                            <p>Total Transactions: {dashboardData.totalTransactions}</p>
                            <p>Active Users: {dashboardData.activeUsers}</p>
                            <p>Total Rewards: {dashboardData.totalRewards} TFUEL</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header>User Metrics</Card.Header>
                        <Card.Body>
                            {userMetrics ? (
                                <>
                                    <p>My Transactions: {userMetrics.transactions}</p>
                                    <p>My Rewards: {userMetrics.rewards} TFUEL</p>
                                    <p>My Compute Power: {userMetrics.computePower} units</p>
                                </>
                            ) : (
                                <p>No metrics available</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Add more widgets or components as needed */}
        </div>
    );
};

export default HomeDash;
