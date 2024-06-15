import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editUserEmail, setEditUserEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/users`)
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  };

  const handleDelete = (email) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/api/users/${email}`)
      .then(() => fetchUsers())
      .catch(error => console.error(error));
  };

  const handleEdit = (user) => {
    setEditUserEmail(user.email);
    setNewName(user.name);
    setNewEmail(user.email);
  };

  const handleSave = (email) => {
    axios.put(`${process.env.REACT_APP_API_URL}/api/users/${email}`, { name: newName, email: newEmail })
      .then(() => {
        setEditUserEmail('');
        fetchUsers();
      })
      .catch(error => console.error(error));
  };

  const handleCancel = () => {
    setEditUserEmail('');
  };

  return (
    <div className="container">
      <h2>Users</h2>
      <div className="list-group">
        {users.map(user => (
          <div key={user.email} className="list-group-item">
            {editUserEmail === user.email ? (
              <>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Name"
                />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Email"
                />
                <FaSave onClick={() => handleSave(user.email)} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                <FaTimes onClick={handleCancel} style={{ cursor: 'pointer', marginLeft: '10px' }} />
              </>
            ) : (
              <>
                <h5 className="mb-1">{user.name}</h5>
                <p className="mb-1">{user.email}</p>
                <FaEdit onClick={() => handleEdit(user)} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                <FaTrash onClick={() => handleDelete(user.email)} style={{ cursor: 'pointer', marginLeft: '10px' }} />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
