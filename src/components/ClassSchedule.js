import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { FaPlus, FaTimes, FaArrowLeft, FaArrowRight, FaPlusCircle } from 'react-icons/fa';

const ClassSchedule = ({ user }) => {
  const [weekSchedule, setWeekSchedule] = useState({});
  const [loading, setLoading] = useState(false);
  const [weekStartDate, setWeekStartDate] = useState(moment().startOf('isoWeek'));
  const [newClass, setNewClass] = useState({ day: '', title: '', time: '' });

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchWeekSchedule(weekStartDate);
  }, [weekStartDate]);

  const fetchWeekSchedule = (startDate) => {
    axios.get(`${API_URL}/api/weeks/start/${startDate.format('YYYY-MM-DD')}`)
      .then(response => {
        console.log('Week Schedule:', response.data); // Log the response data
        setWeekSchedule(response.data);
      })
      .catch(error => console.error(error));
  };

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

  const handlePreviousWeek = () => {
    setWeekStartDate(prevDate => prevDate.clone().subtract(1, 'week'));
  };

  const handleNextWeek = () => {
    setWeekStartDate(prevDate => prevDate.clone().add(1, 'week'));
  };

  const handleAddClass = (day) => {
    if (!newClass.title || !newClass.time) return;

    const newClassData = { title: newClass.title, time: newClass.time, students: [] };

    axios.post(`${API_URL}/api/weeks/${weekSchedule._id}/days/${day}/classes`, newClassData)
      .then(response => {
        setWeekSchedule(prevWeek => {
          const updatedDays = prevWeek.days.map(dayItem => {
            if (dayItem.dayOfWeek === day) {
              return {
                ...dayItem,
                classes: [...dayItem.classes, response.data]
              };
            }
            return dayItem;
          });
          return { ...prevWeek, days: updatedDays };
        });
        setNewClass({ day: '', title: '', time: '' });
      })
      .catch(error => console.error(error));
  };

  if (!user) {
    return <p>Please log in to view the class schedule.</p>;
  }

  const daysOfWeek = weekSchedule.days?.map(day => day.dayOfWeek) || [];

  return (
    <div className="container">
      <h1>Class Schedule</h1>
      {loading && <p>Loading...</p>}
      <div className="week-navigation">
        <button onClick={handlePreviousWeek} className="btn btn-navigation">
          <FaArrowLeft /> Previous Week
        </button>
        <span className="week-date">{weekStartDate.format('MMMM Do YYYY')}</span>
        <button onClick={handleNextWeek} className="btn btn-navigation">
          Next Week <FaArrowRight />
        </button>
      </div>
      <div className="row">
        {daysOfWeek.map(day => {
          const daySchedule = weekSchedule.days?.find(d => d.dayOfWeek === day);
          return (
            <div key={day} className="col-sm-12 col-md-6 col-lg-4">
              <div className="class-card">
                <h2 className="day-header">
                  {day} 
                  <FaPlusCircle 
                    onClick={() => setNewClass({ ...newClass, day })} 
                    style={{ cursor: 'pointer', color: '#FF6600', marginLeft: '10px' }} 
                  />
                </h2>
                {newClass.day === day && (
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
                    <button onClick={() => handleAddClass(day)}>Add Class</button>
                  </div>
                )}
                {daySchedule && daySchedule.classes.length > 0 ? (
                  daySchedule.classes.map((cls, index) => (
                    <div key={index} className="class-item">
                      <p className="class-subheader">
                        {cls.title} - {cls.time} 
                        <FaPlus 
                          onClick={() => handleAddStudent(day, cls.time)} 
                          style={{ cursor: 'pointer', color: '#FF6600', marginLeft: '10px' }} 
                        />
                      </p>
                      {cls.students.map((student, idx) => (
                        <div key={idx} className="student-box">
                          {student}
                          <FaTimes 
                            onClick={() => handleRemoveStudent(day, cls.time, student)} 
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
        })}
      </div>
    </div>
  );
};

export default ClassSchedule;
