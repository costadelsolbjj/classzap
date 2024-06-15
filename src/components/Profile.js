import React, { useState } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const Profile = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [newEmail, setNewEmail] = useState(user.email);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    axios.put(`${process.env.REACT_APP_API_URL}/api/users/${user.email}`, { name: newName, email: newEmail })
      .then(response => {
        setUser({ ...user, name: newName, email: newEmail });
        setIsEditing(false);
      })
      .catch(error => console.error(error));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewName(user.name);
    setNewEmail(user.email);
  };

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="container">
      <h2>Profile</h2>
      <div className="card">
        <div className="card-body">
          {isEditing ? (
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
              <FaSave onClick={handleSave} style={{ cursor: 'pointer', marginLeft: '10px' }} />
              <FaTimes onClick={handleCancel} style={{ cursor: 'pointer', marginLeft: '10px' }} />
            </>
          ) : (
            <>
              <h5 className="card-title">Name: {user.name}</h5>
              <p className="card-text">Email: {user.email}</p>
              <FaEdit onClick={handleEdit} style={{ cursor: 'pointer', marginLeft: '10px' }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
