import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { FaPlus, FaTimes, FaArrowLeft, FaArrowRight, FaPlusCircle } from 'react-icons/fa';

const DailySchedule = ({ user }) => {
  const [daySchedule, setDaySchedule] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(moment().startOf('day'));
  const [newClass, setNewClass] = useState({ title: '', time: '' });

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchDaySchedule(currentDate);
  }, [currentDate]);

  const fetchDaySchedule = (date) => {
    setLoading(true);
    axios.get(`${API_URL}/api/days/${date.format('YYYY-MM-DD')}`)
      .then(response => {
        console.log('Day Schedule:', response.data); // Log the response data
        setDaySchedule(response.data);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  const handleAddStudent = (classTime) => {
    if (user && user.name) {
      setLoading(true); // Show loading state
      axios.post(`${API_URL}/api/days/${currentDate.format('YYYY-MM-DD')}/classes/${classTime}/register`, { studentName: user.name })
        .then(response => {
          setDaySchedule(prevDay => ({
            ...prevDay,
            classes: prevDay.classes.map(cls => 
              cls.time === classTime ? response.data : cls
            )
          }));
        })
        .catch(error => console.error(error))
        .finally(() => setLoading(false)); // Hide loading state
    }
  };

  const handleRemoveStudent = (classTime, studentName) => {
    setLoading(true); // Show loading state
    axios.post(`${API_URL}/api/days/${currentDate.format('YYYY-MM-DD')}/classes/${classTime}/remove`, { studentName })
      .then(response => {
        setDaySchedule(prevDay => ({
          ...prevDay,
          classes: prevDay.classes.map(cls => 
            cls.time === classTime ? response.data : cls
          )
        }));
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false)); // Hide loading state
  };

  const handlePreviousDay = () => {
    setCurrentDate(prevDate => prevDate.clone().subtract(1, 'day'));
  };

  const handleNextDay = () => {
    setCurrentDate(prevDate => prevDate.clone().add(1, 'day'));
  };

  const handleAddClass = () => {
    if (!newClass.title || !newClass.time) return;

    const newClassData = { title: newClass.title, time: newClass.time, students: [] };

    axios.post(`${API_URL}/api/days/${currentDate.format('YYYY-MM-DD')}/classes`, newClassData)
      .then(response => {
        setDaySchedule(prevDay => ({
          ...prevDay,
          classes: [...prevDay.classes, response.data]
        }));
        setNewClass({ title: '', time: '' });
      })
      .catch(error => console.error(error));
  };

  if (!user) {
    return <p>Please log in to view the class schedule.</p>;
  }

  return (
    <div className="container">
      <h1>Daily Schedule</h1>
      {loading && <p>Loading...</p>}
      <div className="day-navigation">
        <button onClick={handlePreviousDay} className="btn btn-navigation">
          <FaArrowLeft /> Previous Day
        </button>
        <span className="day-date">{currentDate.format('MMMM Do YYYY')}</span>
        <button onClick={handleNextDay} className="btn btn-navigation">
          Next Day <FaArrowRight />
        </button>
      </div>
      <div className="day-schedule">
        <h2 className="day-header">
          {currentDate.format('dddd')} 
          <FaPlusCircle 
            onClick={() => setNewClass({ title: '', time: '' })} 
            style={{ cursor: 'pointer', color: '#FF6600', marginLeft: '10px' }} 
          />
        </h2>
        {newClass && (
          <div className="new-class-form">
            <input 
              type="text" 
              placeholder="Class Title" 
              value={newClass.title}
              onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
            />
            <input 
              type="time" 
              placeholder="Class Time" 
              value={newClass.time}
              onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
            />
            <button onClick={handleAddClass}>Add Class</button>
          </div>
        )}
        {daySchedule.classes && daySchedule.classes.length > 0 ? (
          daySchedule.classes.map((cls, index) => (
            <div key={index} className="class-item">
              <p className="class-subheader">
                {cls.title} - {cls.time} 
                <FaPlus 
                  onClick={() => handleAddStudent(cls.time)} 
                  style={{ cursor: 'pointer', color: '#FF6600', marginLeft: '10px' }} 
                />
              </p>
              {cls.students.map((student, idx) => (
                <div key={idx} className="student-box">
                  {student}
                  <FaTimes 
                    onClick={() => handleRemoveStudent(cls.time, student)} 
                    style={{ cursor: 'pointer', color: '#FF6600', marginLeft: '10px' }} 
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
};

export default DailySchedule;
