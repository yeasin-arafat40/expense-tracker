// client/src/pages/Transactions.jsx
import { useState, useEffect } from 'react';
import API from '../utils/api';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import TransactionForm from '../components/TransactionForm';
import TransactionCard from '../components/TransactionCard';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const toast = useToast();

  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    search: '',
  });

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.type !== 'all') params.type = filters.type;
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.search) params.search = filters.search;

      const { data } = await API.get('/transactions', { params });
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleEdit = (tx) => {
    setEditData(tx);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await API.delete(`/transactions/${id}`);
      toast.success('Transaction deleted');
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleSuccess = () => {
    toast.success(editData ? 'Transaction updated!' : 'Transaction added!');
    fetchTransactions();
  };

  const clearFilters = () => {
    setFilters({ type: 'all', category: 'all', search: '' });
  };

  return (
    <div className="transactions-page">
      <div className="tx-header">
        <div>
          <h1>Transactions</h1>
          <p>{transactions.length} transaction(s)</p>
        </div>
        <button className="tx-add-btn" onClick={handleAdd}>
          + Add Transaction
        </button>
      </div>

      <div className="tx-filters">
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="all">All Categories</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Bills">Bills</option>
          <option value="Shopping">Shopping</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Rent">Rent</option>
          <option value="Salary">Salary</option>
          <option value="Freelance">Freelance</option>
          <option value="Gift">Gift</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          placeholder="Search note..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <button className="tx-clear-btn" onClick={clearFilters}>
          Clear
        </button>
      </div>

      {loading ? (
        <div className="tx-loading">Loading...</div>
      ) : transactions.length === 0 ? (
        <div className="tx-empty">
          <p>💸 No transactions yet</p>
          <button className="tx-add-btn" onClick={handleAdd}>
            + Add your first transaction
          </button>
        </div>
      ) : (
        <div className="tx-list">
          {transactions.map((tx) => (
            <TransactionCard
              key={tx._id}
              transaction={tx}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editData ? 'Edit Transaction' : 'Add Transaction'}
      >
        <TransactionForm
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
          editData={editData}
        />
      </Modal>
    </div>
  );
};

export default Transactions;