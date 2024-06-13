import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ClassSchedule from './components/ClassSchedule';
import ClassForm from './components/ClassForm';
import StudentRegistration from './components/StudentRegistration';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/schedule" />} />
          <Route path="/schedule" element={<ClassSchedule />} />
          <Route path="/create-class" element={<ClassForm />} />
          <Route path="/register" element={<StudentRegistration />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
