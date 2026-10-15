// client/src/components/TransactionCard.jsx
import './TransactionCard.css';

const TransactionCard = ({ transaction, onEdit, onDelete }) => {
  const { type, amount, category, note, date } = transaction;

  const formatCurrency = (amt) => {
    return `৳${Number(amt).toLocaleString('en-BD')}`;
  };

  const formatDate = (d) => {
    return new Date(d).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className={`tx-card ${type}`}>
      <div className="tx-card-left">
        <div className={`tx-icon ${type}`}>
          {type === 'income' ? '📈' : '📉'}
        </div>
        <div className="tx-info">
          <h4>{category}</h4>
          {note && <p className="tx-note">{note}</p>}
          <p className="tx-date">{formatDate(date)}</p>
        </div>
      </div>

      <div className="tx-card-right">
        <span className={`tx-amount ${type}`}>
          {type === 'income' ? '+' : '-'} {formatCurrency(amount)}
        </span>
        <div className="tx-actions-btns">
          <button className="tx-icon-btn edit" onClick={() => onEdit(transaction)}>
            ✏️
          </button>
          <button className="tx-icon-btn delete" onClick={() => onDelete(transaction._id)}>
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;