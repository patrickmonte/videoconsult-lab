import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Appointment = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSchedule = async () => {
    setError('');
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ date, time })
      });
      if (response.ok) {
        navigate(`/call-room?date=${date}&time=${time}`);
      } else {
        setError('Erro ao agendar.');
      }
    } catch {
      setError('Erro de conexão.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Agendar Consulta</h2>
      <div className="flex flex-col space-y-4">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-3 py-3 border rounded text-lg" />
        <input type="time" value={time} onChange={e => setTime(e.target.value)} className="px-3 py-3 border rounded text-lg" />
        {error && <div className="text-red-600 text-center">{error}</div>}
        <button onClick={handleSchedule} className="bg-green-600 text-white py-3 rounded text-xl font-bold mt-2">
          Agendar
        </button>
      </div>
    </div>
  );
};

export default Appointment;
