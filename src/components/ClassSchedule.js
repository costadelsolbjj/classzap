import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ClassSchedule = ({ user }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`${API_URL}/api/classes`)
      .then(response => setClasses(response.data))
      .catch(error => console.error(error));
  }, [API_URL]);

  const handleAddStudent = (classId) => {
    setSelectedClassId(classId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedClassId && user && user.name) {
      axios.post(`${API_URL}/api/classes/${selectedClassId}/register`, { studentName: user.name })
        .then(response => {
          setClasses(classes.map(cls => cls.id === response.data.id ? response.data : cls));
          setSelectedClassId(null);
        })
        .catch(error => console.error(error));
    }
  };

  if (!user) {
    return <p>Please log in to view the class schedule.</p>;
  }

  return (
    <div className="container">
      <h1>Class Schedule</h1>
      <div className="row">
        {daysOfWeek.map(day => {
          const cls = classes.find(c => c.day === day);
          return (
            <div key={day} className="col-sm-12 col-md-6 col-lg-4">
              <div className="class-card">
                <h2>{day}</h2>
                {cls && (
                  <>
                    <p>{cls.name} - {cls.time}</p>
                    <FaPlus onClick={() => handleAddStudent(cls.id)} style={{ cursor: 'pointer' }} />
                    {cls.students.map((student, index) => (
                      <div key={index} className="student-box">{student}</div>
                    ))}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {selectedClassId && (
        <form onSubmit={handleSubmit} className="student-form">
          <h3>Add Student to Class</h3>
          <button type="submit" className="btn btn-primary">Add {user.name}</button>
        </form>
      )}
    </div>
  );
};

export default ClassSchedule;
