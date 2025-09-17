import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Appointment = () => {

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const navigate = useNavigate();

  // Horários padrão (pode ser customizado)
  const allTimes = [
    '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
  ];

  useEffect(() => {
    if (!date) return;
    setLoading(true);
    fetch('/api/appointments')
      .then(res => res.json())
      .then(data => {
        const booked = data.filter(a => a.date === date).map(a => a.time);
        setAvailableTimes(allTimes.filter(t => !booked.includes(t)));
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao buscar horários.');
        setLoading(false);
      });
  }, [date]);

  const handleSchedule = async () => {
    setError('');
    setSuccess(false);
    setLoading(true);
    if (!date || !time) {
      setError('Selecione data e horário.');
      setLoading(false);
      return;
    }
    // Verificar conflito
    const check = await fetch('/api/appointments/check-conflict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, time })
    });
    const { conflict } = await check.json();
    if (conflict) {
      setError('Horário já agendado. Escolha outro.');
      setLoading(false);
      return;
    }
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
        setSuccess(true);
        setTimeout(() => navigate(`/call-room?date=${date}&time=${time}`), 1000);
      } else {
        setError('Erro ao agendar.');
      }
    } catch {
      setError('Erro de conexão.');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Agendar Consulta</h2>
      <div className="flex flex-col space-y-4">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-3 py-3 border rounded text-lg" />
        <select value={time} onChange={e => setTime(e.target.value)} className="px-3 py-3 border rounded text-lg" disabled={!date || loading}>
          <option value="">Selecione o horário</option>
          {availableTimes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {loading && <div className="text-blue-600 text-center">Carregando...</div>}
        {error && <div className="text-red-600 text-center">{error}</div>}
        {success && <div className="text-green-600 text-center">Agendamento realizado com sucesso!</div>}
        <button onClick={handleSchedule} className="bg-green-600 text-white py-3 rounded text-xl font-bold mt-2" disabled={loading}>
          Agendar
        </button>
      </div>
    </div>
  );
};

export default Appointment;
