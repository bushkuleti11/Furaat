import React, { useState, useEffect } from 'react';

function SalesSummary({ role, refreshKey }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sales summary from backend
  useEffect(() => {
    fetchSalesSummary();
  }, [role, refreshKey]);

  const fetchSalesSummary = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/sales-summary', {
        headers: {
          'x-user-role': role,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError('You do not have permission to view sales summary');
        } else {
          throw new Error('Failed to fetch sales summary');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setSummary(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching sales summary:', err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="section">
        <h2>📊 Sales Summary</h2>
        <div className="access-denied">⛔ {error}</div>
      </div>
    );
  }

  if (loading) {
    return <div className="section"><div className="loading">Loading sales summary...</div></div>;
  }

  return (
    <div className="section">
      <h2>📊 Sales Summary</h2>
      {summary ? (
        <>
          <div className="checkout-summary">
            <p>
              <span>Total Revenue:</span>
              <span style={{ color: '#2196F3', fontWeight: 'bold' }}>"${summary.totalRevenue.toFixed(2)}</span>
            </p>
            <p>
              <span>Total Transactions:</span>
              <span>{summary.totalTransactions}</span>
            </p>
            <p>
              <span>Average per Transaction:</span>
              <span>${summary.averageTransaction.toFixed(2)}</span>
            </p>
          </div>

          {/* Transactions Table */}
          {summary.transactions && summary.transactions.length > 0 && (
            <>
              <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Recent Transactions</h3>
              <table className="summary-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Total</th>
                    <th>Paid</th>
                    <th>Balance</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>#{transaction.id}</td>
                      <td>${transaction.total.toFixed(2)}</td>
                      <td>${transaction.paid.toFixed(2)}</td>
                      <td style={{ color: transaction.balance >= 0 ? '#4CAF50' : '#f44336' }}>
                        ${transaction.balance.toFixed(2)}
                      </td>
                      <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      ) : (
        <p style={{ textAlign: 'center', color: '#999' }}>No sales data available</p>
      )}
    </div>
  );
}

export default SalesSummary;
