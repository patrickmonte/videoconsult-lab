import React, { useEffect, useState } from 'react';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showReschedule, setShowReschedule] = useState(null); // id do agendamento
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  useEffect(() => {
    fetch('/api/appointments')
      .then(res => res.json())
      .then(data => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao carregar agendamentos.');
        setLoading(false);
      });
  }, []);

  const handleCancel = async (id) => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAppointments(appointments.filter(a => a._id !== id));
        setSuccess('Agendamento cancelado com sucesso!');
      } else {
        setError('Erro ao cancelar agendamento.');
      }
    } catch {
      setError('Erro de conexão.');
    }
  };


  // Horários padrão (pode ser customizado)
  const allTimes = [
    '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
  ];

  // Buscar horários disponíveis ao abrir modal
  const handleOpenReschedule = (appointment) => {
    setShowReschedule(appointment._id);
    setNewDate(appointment.date);
    setNewTime(appointment.time);
    fetch('/api/appointments')
      .then(res => res.json())
      .then(data => {
        const booked = data.filter(a => a.date === appointment.date && a._id !== appointment._id).map(a => a.time);
        setAvailableTimes(allTimes.filter(t => !booked.includes(t)));
      });
  };

  const handleReschedule = async (id) => {
    setRescheduleLoading(true);
    setError('');
    setSuccess('');
    if (!newDate || !newTime) {
      setError('Selecione data e horário.');
      setRescheduleLoading(false);
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/appointments/${id}/reschedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ date: newDate, time: newTime })
      });
      if (res.ok) {
        setAppointments(appointments.map(a => a._id === id ? { ...a, date: newDate, time: newTime } : a));
        setSuccess('Agendamento reagendado com sucesso!');
        setShowReschedule(null);
      } else if (res.status === 409) {
        setError('Horário já agendado. Escolha outro.');
      } else {
        setError('Erro ao reagendar.');
      }
    } catch {
      setError('Erro de conexão.');
    }
    setRescheduleLoading(false);
  };

  if (loading) return <div>Carregando agendamentos...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Meus Agendamentos</h2>
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {appointments.length === 0 ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2">Data</th>
              <th className="py-2">Horário</th>
              <th className="py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a._id} className="border-t">
                <td className="py-2">{a.date}</td>
                <td className="py-2">{a.time}</td>
                <td className="py-2">
                  <button className="bg-red-500 text-white px-3 py-1 rounded mr-2" onClick={() => handleCancel(a._id)}>
                    Cancelar
                  </button>
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => handleOpenReschedule(a)}>
                    Reagendar
                  </button>
                  {showReschedule === a._id && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                      <div className="bg-white p-6 rounded shadow-lg w-80">
                        <h3 className="text-lg font-bold mb-2">Reagendar Consulta</h3>
                        <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full px-3 py-2 border rounded mb-2" />
                        <select value={newTime} onChange={e => setNewTime(e.target.value)} className="w-full px-3 py-2 border rounded mb-2">
                          <option value="">Selecione o horário</option>
                          {availableTimes.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <div className="flex justify-end space-x-2 mt-2">
                          <button className="px-3 py-1 rounded bg-gray-300" onClick={() => setShowReschedule(null)}>Cancelar</button>
                          <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={() => handleReschedule(a._id)} disabled={rescheduleLoading}>
                            {rescheduleLoading ? 'Salvando...' : 'Salvar'}
                          </button>
                        </div>
                        {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyAppointments;
