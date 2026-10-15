// client/src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    transactions: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/transactions/stats');
      const txRes = await API.get('/transactions');
      setStats({
        totalIncome: data.stats.totalIncome,
        totalExpense: data.stats.totalExpense,
        balance: data.stats.balance,
        transactions: txRes.data.count,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    await updateProfile(profileData.name, profileData.email);
    setProfileLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    const result = await changePassword(
      passwordData.currentPassword,
      passwordData.newPassword
    );

    if (result.success) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } else {
      setPasswordError(result.message);
    }
    setPasswordLoading(false);
  };

  const formatCurrency = (amount) => {
    return `৳${Number(amount).toLocaleString('en-BD')}`;
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Profile</h1>
        <p>Manage your account settings</p>
      </div>

      <div className="profile-card profile-hero">
        <div className="profile-avatar-large">{initials}</div>
        <div className="profile-hero-info">
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
          <span className="profile-badge">🎯 Active Member</span>
        </div>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <span className="profile-stat-icon">💸</span>
          <div>
            <p className="profile-stat-label">Transactions</p>
            <h3 className="profile-stat-value">{stats.transactions}</h3>
          </div>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-icon">📈</span>
          <div>
            <p className="profile-stat-label">Total Income</p>
            <h3 className="profile-stat-value income">
              {formatCurrency(stats.totalIncome)}
            </h3>
          </div>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-icon">📉</span>
          <div>
            <p className="profile-stat-label">Total Expense</p>
            <h3 className="profile-stat-value expense">
              {formatCurrency(stats.totalExpense)}
            </h3>
          </div>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-icon">💼</span>
          <div>
            <p className="profile-stat-label">Balance</p>
            <h3 className="profile-stat-value">
              {formatCurrency(stats.balance)}
            </h3>
          </div>
        </div>
      </div>

      <div className="profile-card">
        <h2>👤 Personal Information</h2>
        <form onSubmit={handleProfileSubmit} className="profile-form">
          <div className="profile-group">
            <label>Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) =>
                setProfileData({ ...profileData, name: e.target.value })
              }
              required
              minLength={2}
            />
          </div>
          <div className="profile-group">
            <label>Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData({ ...profileData, email: e.target.value })
              }
              required
            />
          </div>
          <button
            type="submit"
            className="profile-btn"
            disabled={profileLoading}
          >
            {profileLoading ? 'Saving...' : '💾 Save Changes'}
          </button>
        </form>
      </div>

      <div className="profile-card">
        <h2>🔒 Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="profile-form">
          {passwordError && (
            <div className="profile-error">{passwordError}</div>
          )}

          <div className="profile-group">
            <label>Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
              placeholder="Enter current password"
              required
            />
          </div>

          <div className="profile-group">
            <label>New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
              placeholder="Enter new password (min 6 chars)"
              required
              minLength={6}
            />
          </div>

          <div className="profile-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              placeholder="Re-enter new password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="profile-btn"
            disabled={passwordLoading}
          >
            {passwordLoading ? 'Changing...' : '🔑 Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;