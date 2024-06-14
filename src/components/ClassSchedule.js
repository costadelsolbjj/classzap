import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTimes } from 'react-icons/fa';

const ClassSchedule = ({ user }) => {
  const [weekSchedule, setWeekSchedule] = useState({});
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;
  const weekStartDate = '2024-06-03'; // Your week start date for testing

  useEffect(() => {
    axios.get(`${API_URL}/api/weeks/start/${weekStartDate}`)
      .then(response => {
        console.log('Week Schedule:', response.data); // Log the response data
        setWeekSchedule(response.data);
      })
      .catch(error => console.error(error));
  }, [API_URL, weekStartDate]);

  const handleAddStudent = (day, classTime) => {
    if (user && user.name) {
      setLoading(true); // Show loading state
      axios.post(`${API_URL}/api/weeks/${weekSchedule._id}/days/${day}/classes/${classTime}/register`, { studentName: user.name })
        .then(response => {
          setWeekSchedule(prevWeek => {
            const updatedDays = prevWeek.days.map(dayItem => {
              if (dayItem.dayOfWeek === day) {
                return {
                  ...dayItem,
                  classes: dayItem.classes.map(cls => 
                    cls.time === classTime ? response.data : cls
                  )
                };
              }
              return dayItem;
            });
            return { ...prevWeek, days: updatedDays };
          });
        })
        .catch(error => console.error(error))
        .finally(() => setLoading(false)); // Hide loading state
    }
  };

  const handleRemoveStudent = (day, classTime, studentName) => {
    setLoading(true); // Show loading state
    axios.post(`${API_URL}/api/weeks/${weekSchedule._id}/days/${day}/classes/${classTime}/remove`, { studentName })
      .then(response => {
        setWeekSchedule(prevWeek => {
          const updatedDays = prevWeek.days.map(dayItem => {
            if (dayItem.dayOfWeek === day) {
              return {
                ...dayItem,
                classes: dayItem.classes.map(cls => 
                  cls.time === classTime ? response.data : cls
                )
              };
            }
            return dayItem;
          });
          return { ...prevWeek, days: updatedDays };
        });
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false)); // Hide loading state
  };

  if (!user) {
    return <p>Please log in to view the class schedule.</p>;
  }

  const daysOfWeek = weekSchedule.days?.map(day => day.dayOfWeek) || [];

  return (
    <div className="container">
      <h1>Class Schedule</h1>
      {loading && <p>Loading...</p>}
      <div className="row">
        {daysOfWeek.map(day => {
          const daySchedule = weekSchedule.days?.find(d => d.dayOfWeek === day);
          return (
            <div key={day} className="col-sm-12 col-md-6 col-lg-4">
              <div className="class-card">
                <h2>{day}</h2>
                {daySchedule && daySchedule.classes.length > 0 ? (
                  daySchedule.classes.map((cls, index) => (
                    <div key={index}>
                      <p>{cls.title} - {cls.time}</p>
                      <FaPlus onClick={() => handleAddStudent(day, cls.time)} style={{ cursor: 'pointer' }} />
                      {cls.students.map((student, idx) => (
                        <div key={idx} className="student-box">
                          {student}
                          <FaTimes 
                            onClick={() => handleRemoveStudent(day, cls.time, student)} 
                            style={{ cursor: 'pointer', marginLeft: '10px' }} 
                          />
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <p>No classes scheduled</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClassSchedule;
