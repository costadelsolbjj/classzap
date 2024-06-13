import React from 'react';

const Profile = ({ user }) => {
  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="container">
      <h2>Profile</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Name: {user.name}</h5>
          <p className="card-text">Email: {user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
