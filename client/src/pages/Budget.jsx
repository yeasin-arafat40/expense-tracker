// client/src/pages/Budget.jsx
import { useState, useEffect } from 'react';
import API from '../utils/api';
import './Budget.css';

const CATEGORIES = [
  'Food', 'Transport', 'Bills', 'Shopping',
  'Health', 'Education', 'Rent', 'Other',
];

const Budget = () => {
  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const [month, setMonth] = useState(currentMonth);
  const [budget, setBudget] = useState(null);
  const [totalBudget, setTotalBudget] = useState('');
  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [spending, setSpending] = useState({});
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [month]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch budget
      const { data: budgetData } = await API.get(`/budget/${month}`);
      setBudget(budgetData.budget);
      setTotalBudget(budgetData.budget.totalBudget || '');
      setCategoryBudgets(budgetData.budget.categoryBudgets || {});

      // Fetch expenses for this month
      const startDate = `${month}-01`;
      const endDate = `${month}-31`;
      const { data: txData } = await API.get('/transactions', {
        params: { type: 'expense', startDate, endDate },
      });

      const spendingMap = {};
      let total = 0;
      txData.transactions.forEach((tx) => {
        spendingMap[tx.category] = (spendingMap[tx.category] || 0) + tx.amount;
        total += tx.amount;
      });

      setSpending(spendingMap);
      setTotalSpent(total);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await API.post('/budget', {
        month,
        totalBudget: Number(totalBudget) || 0,
        categoryBudgets: Object.fromEntries(
          Object.entries(categoryBudgets).map(([k, v]) => [k, Number(v) || 0])
        ),
      });
      setMessage('✅ Budget saved successfully!');
      fetchData();
    } catch (error) {
      setMessage('❌ Failed to save budget');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getProgressColor = (percent) => {
    if (percent >= 100) return '#ef4444';
    if (percent >= 80) return '#f59e0b';
    return '#10b981';
  };

  if (loading) return <div className="loading">Loading...</div>;

  const totalPercent =
    totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  return (
    <div className="budget-page">
      <div className="budget-header">
        <div>
          <h1>Budget</h1>
          <p>Set and track your monthly budget</p>
        </div>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="month-picker"
        />
      </div>

      {message && <div className="budget-message">{message}</div>}

      {/* Total Budget */}
      <div className="budget-card">
        <h2>💰 Total Budget</h2>
        <div className="budget-total-row">
          <div className="budget-input-group">
            <label>Monthly Budget (৳)</label>
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
          <div className="budget-summary">
            <div className="summary-row">
              <span>Spent:</span>
              <strong>৳{totalSpent.toLocaleString('en-BD')}</strong>
            </div>
            <div className="summary-row">
              <span>Remaining:</span>
              <strong style={{ color: totalSpent > totalBudget ? '#ef4444' : '#10b981' }}>
                ৳{Math.max(totalBudget - totalSpent, 0).toLocaleString('en-BD')}
              </strong>
            </div>
          </div>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${totalPercent}%`,
              background: getProgressColor(totalPercent),
            }}
          />
        </div>
        <p className="progress-text">
          {totalPercent.toFixed(1)}% of budget used
        </p>
      </div>

      {/* Category Budgets */}
      <div className="budget-card">
        <h2>📂 Category Budgets</h2>
        <div className="category-grid">
          {CATEGORIES.map((cat) => {
            const limit = Number(categoryBudgets[cat]) || 0;
            const spent = spending[cat] || 0;
            const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
            const overBudget = limit > 0 && spent > limit;

            return (
              <div key={cat} className="category-budget-item">
                <div className="category-header">
                  <span className="category-name">{cat}</span>
                  <span className={`category-status ${overBudget ? 'over' : ''}`}>
                    ৳{spent.toLocaleString('en-BD')} / ৳{limit.toLocaleString('en-BD')}
                  </span>
                </div>
                <input
                  type="number"
                  value={categoryBudgets[cat] || ''}
                  onChange={(e) =>
                    setCategoryBudgets({ ...categoryBudgets, [cat]: e.target.value })
                  }
                  placeholder="Set limit"
                  min="0"
                />
                {limit > 0 && (
                  <div className="mini-progress">
                    <div
                      className="mini-progress-fill"
                      style={{
                        width: `${percent}%`,
                        background: getProgressColor(percent),
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button className="budget-save-btn" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : '💾 Save Budget'}
      </button>
    </div>
  );
};

export default Budget;