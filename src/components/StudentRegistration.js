import React, { useState } from 'react';
import axios from 'axios';

const StudentRegistration = () => {
  const [studentName, setStudentName] = useState('');
  const [classId, setClassId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`/api/classes/${classId}/register`, { studentName })
      .then(response => {
        console.log(response.data);
        // Optionally update the UI or notify the user
      })
      .catch(error => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Student Name</label>
        <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
      </div>
      <div>
        <label>Class ID</label>
        <input type="text" value={classId} onChange={(e) => setClassId(e.target.value)} />
      </div>
      <button type="submit">Register for Class</button>
    </form>
  );
};

export default StudentRegistration;
