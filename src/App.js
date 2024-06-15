import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import ClassSchedule from './components/ClassSchedule';
import DailySchedule from './components/DailySchedule';
import Profile from './components/Profile';
import Users from './components/Users';
import CreateUser from './components/CreateUser';
import CreateWeek from './components/CreateWeek';
import { FaBars, FaTimes } from 'react-icons/fa';
import './App.css'; // Ensure to create and import the CSS file

const App = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <div className="app-container">
        <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
          <button className="menu-close" onClick={toggleMenu}>
            <FaTimes />
          </button>
          <ul>
            <li>
              <Link to="/" onClick={toggleMenu}>Home</Link>
            </li>
            {user && (
              <>
                <li>
                  <Link to="/schedule" onClick={toggleMenu}>Schedule</Link>
                </li>
                <li>
                  <Link to="/daily" onClick={toggleMenu}>Daily Schedule</Link>
                </li>
                <li>
                  <Link to="/profile" onClick={toggleMenu}>Profile</Link>
                </li>
                {user.email === 'Douglas@outlook.com' && (
                  <>
                    <li>
                      <Link to="/users" onClick={toggleMenu}>Users</Link>
                    </li>
                    <li>
                      <Link to="/create-user" onClick={toggleMenu}>Create User</Link>
                    </li>
                    <li>
                      <Link to="/create-week" onClick={toggleMenu}>Create Week</Link>
                    </li>
                  </>
                )}
                <li>
                  <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
        <header className="app-header">
          <button className="menu-toggle" onClick={toggleMenu}>
            <FaBars />
          </button>
          <h1>ClassZap</h1>
        </header>
        <main className="app-content">
          <Routes>
            <Route path="/" element={<Login setUser={setUser} />} />
            <Route path="/schedule" element={<ClassSchedule user={user} />} />
            <Route path="/daily" element={<DailySchedule user={user} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/users" element={user?.email === 'Douglas@outlook.com' ? <Users /> : <p>Access Denied</p>} />
            <Route path="/create-user" element={user?.email === 'Douglas@outlook.com' ? <CreateUser /> : <p>Access Denied</p>} />
            <Route path="/create-week" element={user?.email === 'Douglas@outlook.com' ? <CreateWeek user={user} /> : <p>Access Denied</p>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
