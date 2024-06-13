import React, { useState } from 'react';
import axios from 'axios';

const ClassForm = () => {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/classes', { name, time })
      .then(response => {
        console.log(response.data);
        // Optionally update the UI or notify the user
      })
      .catch(error => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Class Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Class Time</label>
        <input type="text" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>
      <button type="submit">Create Class</button>
    </form>
  );
};

export default ClassForm;
