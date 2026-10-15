// client/src/components/TransactionForm.jsx
import { useState, useEffect } from 'react';
import API from '../utils/api';
import { useToast } from '../context/ToastContext';
import './TransactionForm.css';

const CATEGORIES = [
  'Food',
  'Transport',
  'Bills',
  'Shopping',
  'Health',
  'Education',
  'Rent',
  'Salary',
  'Freelance',
  'Gift',
  'Other',
];

const TransactionForm = ({ isOpen, onClose, onSuccess, editData }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Food',
    note: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (editData) {
      setFormData({
        type: editData.type,
        amount: editData.amount,
        category: editData.category,
        note: editData.note || '',
        date: new Date(editData.date).toISOString().split('T')[0],
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
      };

      if (editData) {
        await API.put(`/transactions/${editData._id}`, payload);
        toast.success('Transaction updated!');
      } else {
        await API.post('/transactions', payload);
        toast.success('Transaction added!');
      }

      onSuccess();
      onClose();
      setFormData({
        type: 'expense',
        amount: '',
        category: 'Food',
        note: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="tx-form">
      {error && <div className="tx-error">{error}</div>}

      <div className="tx-type-toggle">
        <button
          type="button"
          className={`tx-type-btn ${
            formData.type === 'expense' ? 'active expense' : ''
          }`}
          onClick={() => setFormData({ ...formData, type: 'expense' })}
        >
          📉 Expense
        </button>
        <button
          type="button"
          className={`tx-type-btn ${
            formData.type === 'income' ? 'active income' : ''
          }`}
          onClick={() => setFormData({ ...formData, type: 'income' })}
        >
          📈 Income
        </button>
      </div>

      <div className="tx-group">
        <label>Amount (৳)</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="tx-group">
        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="tx-group">
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="tx-group">
        <label>Note (optional)</label>
        <input
          type="text"
          name="note"
          value={formData.note}
          onChange={handleChange}
          placeholder="e.g., Lunch with friends"
          maxLength={200}
        />
      </div>

      <div className="tx-actions">
        <button
          type="button"
          className="tx-btn-cancel"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="tx-btn-submit" disabled={loading}>
          {loading ? 'Saving...' : editData ? 'Update' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;