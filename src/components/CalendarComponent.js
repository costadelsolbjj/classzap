// CalendarComponent.js
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaPlus, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weekStartDate, setWeekStartDate] = useState(moment().startOf('isoWeek'));

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchWeekSchedule = useCallback((startDate) => {
    const formattedDate = startDate.format('YYYY-MM-DD');
    setLoading(true);
    axios.get(`${API_URL}/api/weeks/start/${formattedDate}`)
      .then(response => {
        console.log('Week Schedule:', response.data); // Log the response data
        const formattedEvents = response.data.days.flatMap(day =>
          day.classes.map(cls => ({
            title: cls.title,
            start: new Date(day.date + 'T' + cls.time),
            end: new Date(day.date + 'T' + cls.time),
            students: cls.students,
            day: day.dayOfWeek,
            time: cls.time,
          }))
        );
        setEvents(formattedEvents);
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, [API_URL]);

  useEffect(() => {
    fetchWeekSchedule(weekStartDate);
  }, [weekStartDate, fetchWeekSchedule]);

  const handleAddStudent = (event) => {
    if (user && user.name) {
      setLoading(true); // Show loading state
      axios.post(`${API_URL}/api/weeks/${weekStartDate.format('YYYY-MM-DD')}/days/${event.day}/classes/${event.time}/register`, { studentName: user.name })
        .then(response => {
          setEvents(events.map(evt =>
            evt.start.getTime() === event.start.getTime() ? { ...evt, students: [...evt.students, user.name] } : evt
          ));
        })
        .catch(error => console.error(error))
        .finally(() => setLoading(false)); // Hide loading state
    }
  };

  const handleRemoveStudent = (event, studentName) => {
    setLoading(true); // Show loading state
    axios.post(`${API_URL}/api/weeks/${weekStartDate.format('YYYY-MM-DD')}/days/${event.day}/classes/${event.time}/remove`, { studentName })
      .then(response => {
        setEvents(events.map(evt =>
          evt.start.getTime() === event.start.getTime() ? { ...evt, students: evt.students.filter(student => student !== studentName) } : evt
        ));
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false)); // Hide loading state
  };

  const eventPropGetter = (event) => {
    return {
      style: {
        backgroundColor: '#f9c74f',
        borderRadius: '5px',
        border: 'none',
        color: 'black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '5px',
      }
    };
  };

  const EventComponent = ({ event }) => {
    return (
      <div>
        <span>{event.title}</span>
        {event.students.map((student, idx) => (
          <div key={idx} className="student-box">
            {student}
            <FaTimes
              onClick={() => handleRemoveStudent(event, student)}
              style={{ cursor: 'pointer', marginLeft: '10px' }}
            />
          </div>
        ))}
        <FaPlus onClick={() => handleAddStudent(event)} style={{ cursor: 'pointer', marginLeft: '10px' }} />
      </div>
    );
  };

  const handlePreviousWeek = () => {
    setWeekStartDate(prevDate => prevDate.clone().subtract(1, 'weeks'));
  };

  const handleNextWeek = () => {
    setWeekStartDate(prevDate => prevDate.clone().add(1, 'weeks'));
  };

  return (
    <div className="calendar-container">
      {loading && <p>Loading...</p>}
      <button onClick={handlePreviousWeek} className="btn btn-secondary">Previous Week</button>
      <button onClick={handleNextWeek} className="btn btn-secondary">Next Week</button>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventPropGetter}
        components={{
          event: EventComponent,
        }}
      />
    </div>
  );
};

export default CalendarComponent;
