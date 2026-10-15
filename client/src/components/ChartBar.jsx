// client/src/components/ChartBar.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const ChartBar = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        <p>📊 No monthly data yet</p>
      </div>
    );
  }

  // Group by month
  const grouped = {};
  data.forEach((item) => {
    const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
    if (!grouped[key]) {
      grouped[key] = {
        month: MONTHS[item._id.month - 1],
        income: 0,
        expense: 0,
      };
    }
    if (item._id.type === 'income') grouped[key].income = item.total;
    if (item._id.type === 'expense') grouped[key].expense = item.total;
  });

  const chartData = Object.values(grouped);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value) => `৳${Number(value).toLocaleString('en-BD')}`}
        />
        <Legend />
        <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
        <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChartBar;