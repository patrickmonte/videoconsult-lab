import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Appointment from './pages/Appointment';
import CallRoom from './pages/CallRoom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/call-room" element={<CallRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
