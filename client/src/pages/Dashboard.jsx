// client/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import Modal from '../components/Modal';
import TransactionForm from '../components/TransactionForm';
import TransactionCard from '../components/TransactionCard';
import ChartPie from '../components/ChartPie';
import ChartBar from '../components/ChartBar';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    categoryStats: [],
    monthlyStats: [],
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, txRes] = await Promise.all([
        API.get('/transactions/stats'),
        API.get('/transactions'),
      ]);
      setStats(statsRes.data.stats);
      setRecent(txRes.data.transactions.slice(0, 5));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await API.delete(`/transactions/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatCurrency = (amount) => {
    return `৳${Number(amount).toLocaleString('en-BD')}`;
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name}! 👋</p>
        </div>
        <button className="tx-add-btn" onClick={() => setShowModal(true)}>
          + Add Transaction
        </button>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card income">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <p className="stat-label">Total Income</p>
            <h2 className="stat-value">{formatCurrency(stats.totalIncome)}</h2>
          </div>
        </div>

        <div className="stat-card expense">
          <div className="stat-icon">📉</div>
          <div className="stat-info">
            <p className="stat-label">Total Expense</p>
            <h2 className="stat-value">{formatCurrency(stats.totalExpense)}</h2>
          </div>
        </div>

        <div className="stat-card balance">
          <div className="stat-icon">💼</div>
          <div className="stat-info">
            <p className="stat-label">Balance</p>
            <h2 className="stat-value">{formatCurrency(stats.balance)}</h2>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h2>📊 Expense by Category</h2>
          <ChartPie data={stats.categoryStats} />
        </div>
        <div className="chart-card">
          <h2>📈 Monthly Income vs Expense</h2>
          <ChartBar data={stats.monthlyStats} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="recent-section">
        <div className="recent-header">
          <h2>Recent Transactions</h2>
          <Link to="/transactions" className="see-all-link">
            See all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="dashboard-placeholder">
            <p>💸 No transactions yet. Add your first one!</p>
          </div>
        ) : (
          <div className="recent-list">
            {recent.map((tx) => (
              <TransactionCard
                key={tx._id}
                transaction={tx}
                onEdit={() => {}}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Transaction"
      >
        <TransactionForm
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={fetchData}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;