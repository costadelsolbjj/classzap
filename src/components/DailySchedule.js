import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { format, addDays, subDays } from 'date-fns';

const DailySchedule = ({ user }) => {
  const [daySchedule, setDaySchedule] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date('2024-06-03'));
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchDaySchedule(currentDate);
  }, [currentDate]);

  const fetchDaySchedule = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    setLoading(true);
    axios.get(`${API_URL}/api/weeks/day/${formattedDate}`)
      .then(response => {
        console.log('Day Schedule:', response.data); // Log the response data
        setDaySchedule(response.data);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  const handleAddStudent = (classTime) => {
    if (user && user.name) {
      setLoading(true);
      axios.post(`${API_URL}/api/weeks/day/${format(currentDate, 'yyyy-MM-dd')}/classes/${classTime}/register`, { studentName: user.name })
        .then(response => {
          setDaySchedule(prevDay => {
            const updatedClasses = prevDay.classes.map(cls => 
              cls.time === classTime ? { ...cls, students: [...cls.students, user.name] } : cls
            );
            return { ...prevDay, classes: updatedClasses };
          });
        })
        .catch(error => console.error(error))
        .finally(() => setLoading(false));
    }
  };

  const handleRemoveStudent = (classTime, studentName) => {
    setLoading(true);
    axios.post(`${API_URL}/api/weeks/day/${format(currentDate, 'yyyy-MM-dd')}/classes/${classTime}/remove`, { studentName })
      .then(response => {
        setDaySchedule(prevDay => {
          const updatedClasses = prevDay.classes.map(cls => 
            cls.time === classTime ? { ...cls, students: cls.students.filter(student => student !== studentName) } : cls
          );
          return { ...prevDay, classes: updatedClasses };
        });
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  const handlePreviousDay = () => {
    setCurrentDate(prevDate => subDays(prevDate, 1));
  };

  const handleNextDay = () => {
    setCurrentDate(prevDate => addDays(prevDate, 1));
  };

  if (!user) {
    return <p>Please log in to view the class schedule.</p>;
  }

  return (
    <div className="container">
      <h1>Class Schedule for {format(currentDate, 'yyyy-MM-dd')}</h1>
      <button onClick={handlePreviousDay} className="btn btn-secondary">Previous Day</button>
      <button onClick={handleNextDay} className="btn btn-secondary">Next Day</button>
      {loading && <p>Loading...</p>}
      <div className="row">
        {daySchedule.classes && daySchedule.classes.length > 0 ? (
          daySchedule.classes.map((cls, index) => (
            <div key={index} className="col-sm-12 col-md-6 col-lg-4">
              <div className="class-card">
                <p>{cls.title} - {cls.time}</p>
                <FaPlus onClick={() => handleAddStudent(cls.time)} style={{ cursor: 'pointer' }} />
                {cls.students.map((student, idx) => (
                  <div key={idx} className="student-box">
                    {student}
                    <FaTimes 
                      onClick={() => handleRemoveStudent(cls.time, student)} 
                      style={{ cursor: 'pointer', marginLeft: '10px' }} 
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No classes scheduled</p>
        )}
      </div>
    </div>
  );
};

export default DailySchedule;
