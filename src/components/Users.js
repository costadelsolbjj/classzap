import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/users`)
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="container">
      <h2>Users</h2>
      <div className="list-group">
        {users.map(user => (
          <div key={user.email} className="list-group-item">
            <h5 className="mb-1">{user.name}</h5>
            <p className="mb-1">{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
