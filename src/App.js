import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import ClassSchedule from './components/ClassSchedule';
import DailySchedule from './components/DailySchedule';
import Profile from './components/Profile';
import Users from './components/Users';
import CreateUser from './components/CreateUser';
import CreateWeek from './components/CreateWeek';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="/">ClassZap</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              {user && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/schedule">Schedule</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/daily">Daily Schedule</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">Profile</Link>
                  </li>
                  {user.email === 'Douglas@outlook.com' && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/users">Users</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/create-user">Create User</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/create-week">Create Week</Link>
                      </li>
                    </>
                  )}
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Login setUser={setUser} />} />
          <Route path="/schedule" element={<ClassSchedule user={user} />} />
          <Route path="/daily" element={<DailySchedule user={user} />} />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/users" element={user?.email === 'Douglas@outlook.com' ? <Users /> : <p>Access Denied</p>} />
          <Route path="/create-user" element={user?.email === 'Douglas@outlook.com' ? <CreateUser /> : <p>Access Denied</p>} />
          <Route path="/create-week" element={user?.email === 'Douglas@outlook.com' ? <CreateWeek user={user} /> : <p>Access Denied</p>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
