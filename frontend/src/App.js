import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Appointment from './pages/Appointment';
import CallRoom from './pages/CallRoom';
import EditPatient from './pages/EditPatient';
import Dashboard from './pages/attendant/Dashboard';
import PatientList from './pages/attendant/PatientList';
import MyAppointments from './pages/MyAppointments';
import ChatRoom from './pages/attendant/ChatRoom';
import PatientHistory from './pages/attendant/PatientHistory';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/call-room" element={<CallRoom />} />
        <Route path="/attendant/dashboard" element={<Dashboard />} />
        <Route path="/attendant/patients" element={<PatientList />} />
  <Route path="/edit-patient/:id" element={<EditPatientWrapper />} />
  <Route path="/my-appointments" element={<MyAppointments />} />
  <Route path="/attendant/chat/:roomId" element={<ChatRoom />} />
  <Route path="/attendant/patient-history/:patientId" element={<PatientHistory />} />
      </Routes>
    </Router>
  );
}

// Wrapper para pegar o id da URL
import { useParams } from 'react-router-dom';
function EditPatientWrapper() {
  const { id } = useParams();
  return <EditPatient patientId={id} />;
}

export default App;
