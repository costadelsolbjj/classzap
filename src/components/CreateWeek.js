import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CreateWeek = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  const handleSelectSlot = ({ start }) => {
    const startOfWeek = moment(start).startOf('isoWeek'); // Start of ISO week (Monday)
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => ({
      dayOfWeek: day,
      date: startOfWeek.clone().add(index, 'days').format('YYYY-MM-DD'),
      classes: []
    }));

    const newWeek = {
      weekStartDate: startOfWeek.format('YYYY-MM-DD'),
      weekNumber: startOfWeek.isoWeek(),
      month: startOfWeek.month() + 1,
      year: startOfWeek.year(),
      days
    };

    saveWeek(newWeek);
    setSelectedWeek(startOfWeek);
  };

  const saveWeek = async (newWeek) => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/weeks`, newWeek);
      alert('Week created successfully');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = (event) => {
    if (user && user.email === 'Douglas@outlook.com') {
      const studentName = user.name;
      const updatedEvents = events.map(evt =>
        evt.start.getTime() === event.start.getTime()
          ? { ...evt, students: evt.students.includes(studentName) ? evt.students : [...evt.students, studentName] }
          : evt
      );
      setEvents(updatedEvents);
    }
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

  const dayPropGetter = (date) => {
    if (selectedWeek && moment(date).isBetween(selectedWeek, selectedWeek.clone().endOf('week'), null, '[]')) {
      return {
        style: {
          backgroundColor: '#d1e7dd',
        },
      };
    }
    return {};
  };

  return (
    <div className="container">
      <h2>Create Week</h2>
      <div className="calendar-container">
        {loading && <p>Loading...</p>}
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          views={['month']}
          eventPropGetter={eventPropGetter}
          dayPropGetter={dayPropGetter}
          firstDay={1} // Ensures the week starts on Monday
        />
      </div>
    </div>
  );
};

export default CreateWeek;
