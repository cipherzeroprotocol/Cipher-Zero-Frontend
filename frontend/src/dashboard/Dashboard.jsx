import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaChartLine, FaCog, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import Analytics from './Analytics';
import Notifications from './Notifications'; // Import your notifications component
import RecentActivities from './RecentActivities'; // Import recent activities component
import UserProfile from './UserProfile'; // Import user profile component
import './dashboard.css'; // Import external CSS file for more complex styling

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  return (
    <div className={`dashboard ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <Header userMenuOpen={userMenuOpen} toggleUserMenu={toggleUserMenu} />
        <div className="content">
          <div className="widgets">
            <Analytics />
            <RecentActivities />
            <Notifications />
            {/* Add more widgets or components here */}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarOpen ? '<' : '>'}
      </button>
      <h2 className="sidebar-title">Dashboard</h2>
      <ul className="sidebar-menu">
        <li><Link to="/" className="sidebar-link"><FaHome /> Home</Link></li>
        <li><Link to="/analytics" className="sidebar-link"><FaChartLine /> Analytics</Link></li>
        <li><Link to="/settings" className="sidebar-link"><FaCog /> Settings</Link></li>
        {/* Add more sidebar items here */}
      </ul>
    </div>
  );
};

// Header Component
const Header = ({ userMenuOpen, toggleUserMenu }) => {
  return (
    <div className="header">
      <div className="header-title">Dashboard</div>
      <div className="header-actions">
        <button className="user-menu-button" onClick={toggleUserMenu}>
          <FaUserCircle />
        </button>
        {userMenuOpen && (
          <div className="user-menu">
            <UserProfile />
            <button className="user-menu-item"><FaSignOutAlt /> Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
