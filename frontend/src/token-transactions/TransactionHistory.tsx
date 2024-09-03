// frontend/src/components/TransactionHistory.tsx

import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { getTransactionHistory} from './TokenService'; // Ensure you have a function to fetch transaction history

interface Transaction {
    id: string;
    from: string;
    to: string;
    amount: string;
    timestamp: string;
}

const TransactionHistory: React.FC<{ walletAddress: string }> = ({ walletAddress }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const result = await getTransactionHistory(walletAddress) as unknown as Transaction[];
                setTransactions(result);
            } catch (err) {
                setError('Failed to fetch transaction history.');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [walletAddress]);

    const columns: ColumnsType<Transaction> = [
        {
            title: 'Transaction ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => <a href={`https://explorer.thetatoken.org/transaction/${text}`} target="_blank" rel="noopener noreferrer">{text}</a>,
        },
        {
            title: 'From',
            dataIndex: 'from',
            key: 'from',
            render: (text: string) => <a href={`https://explorer.thetatoken.org/address/${text}`} target="_blank" rel="noopener noreferrer">{text}</a>,
        },
        {
            title: 'To',
            dataIndex: 'to',
            key: 'to',
            render: (text: string) => <a href={`https://explorer.thetatoken.org/address/${text}`} target="_blank" rel="noopener noreferrer">{text}</a>,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (text: string) => `${text} TFuel`, // Customize based on token
        },
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (text: string) => new Date(text).toLocaleString(),
        },
    ];

    return (
        <div>
            {loading && <Spin />}
            {error && <Alert message="Error" description={error} type="error" showIcon />}
            <Table
                dataSource={transactions}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: 'No transactions found' }}
            />
        </div>
    );
};

export default TransactionHistory;
