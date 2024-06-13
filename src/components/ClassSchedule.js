import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClassSchedule = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    axios.get('/api/classes')
      .then(response => setClasses(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Class Schedule</h1>
      <div className="schedule-grid">
        {classes.map(cls => (
          <div key={cls.id} className="class-card">
            <h2>{cls.name}</h2>
            <p>{cls.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassSchedule;
