import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tab, setTab] = useState('consultas');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [exams, setExams] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch('/api/appointments').then(res => res.json()),
      fetch('/api/patients').then(res => res.json()),
      fetch('/api/exams').then(res => res.json()),
      fetch('/api/notifications').then(res => res.json()).catch(() => [])
    ]).then(([apps, pats, exs, nots]) => {
      setAppointments(apps);
      setPatients(pats);
      setExams(exs);
      setNotifications(nots);
      setLoading(false);
    }).catch(() => {
      setError('Erro ao carregar dados.');
      setLoading(false);
    });
  }, []);

  const getPatientName = (id) => {
    const p = patients.find(p => p._id === id);
    return p ? p.name : id;
  };

  const filtered = appointments.filter(a =>
    (!filterDate || a.date === filterDate) &&
    (!filterStatus || a.status === filterStatus)
  );

  function exportCSV() {
    const header = 'Paciente,Data,Horário,Status\n';
    const rows = filtered.map(a => `${getPatientName(a.patientId)},${a.date},${a.time},${a.status}`).join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agendamentos.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <div>Carregando painel...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Painel Administrativo do Atendente</h1>
      <div className="flex space-x-4 mb-6">
        <button className={`px-4 py-2 rounded ${tab==='consultas' ? 'bg-blue-600 text-white' : 'bg-white border'}`} onClick={() => setTab('consultas')}>Consultas</button>
        <button className={`px-4 py-2 rounded ${tab==='pacientes' ? 'bg-blue-600 text-white' : 'bg-white border'}`} onClick={() => setTab('pacientes')}>Pacientes</button>
        <button className={`px-4 py-2 rounded ${tab==='exames' ? 'bg-blue-600 text-white' : 'bg-white border'}`} onClick={() => setTab('exames')}>Exames</button>
        <button className={`px-4 py-2 rounded ${tab==='notificacoes' ? 'bg-blue-600 text-white' : 'bg-white border'}`} onClick={() => setTab('notificacoes')}>Notificações</button>
        <button className={`px-4 py-2 rounded ${tab==='relatorios' ? 'bg-blue-600 text-white' : 'bg-white border'}`} onClick={() => setTab('relatorios')}>Relatórios</button>
      </div>

      {tab === 'consultas' && (
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Consultas Agendadas</h2>
          <div className="flex space-x-4 mb-4">
            <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="border px-2 py-1 rounded" />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border px-2 py-1 rounded">
              <option value="">Todos os status</option>
              <option value="scheduled">Agendado</option>
              <option value="completed">Concluído</option>
              <option value="cancelled">Cancelado</option>
            </select>
            <button className="bg-green-600 text-white px-4 py-1 rounded" onClick={exportCSV}>Exportar CSV</button>
          </div>
          {filtered.length === 0 ? (
            <p>Nenhuma consulta encontrada.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">Paciente</th>
                  <th className="py-2">Data</th>
                  <th className="py-2">Horário</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a._id} className="border-t">
                    <td className="py-2">{getPatientName(a.patientId)}</td>
                    <td className="py-2">{a.date}</td>
                    <td className="py-2">{a.time}</td>
                    <td className="py-2">{a.status}</td>
                    <td className="py-2 flex flex-col md:flex-row gap-2">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => navigate(`/call-room?roomId=${a._id}&sender=attendant`)}>Chamada</button>
                      <button className="bg-purple-500 text-white px-3 py-1 rounded" onClick={() => navigate(`/attendant/chat/${a._id}`)}>Chat</button>
                      <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => navigate(`/attendant/patient-history/${a.patientId}`)}>Histórico</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'pacientes' && (
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Pacientes</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">Nome</th>
                <th className="py-2">E-mail</th>
                <th className="py-2">Telefone</th>
                <th className="py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p._id} className="border-t">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2">{p.email}</td>
                  <td className="py-2">{p.phone}</td>
                  <td className="py-2">
                    <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={() => navigate(`/attendant/patient-history/${p._id}`)}>Histórico</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'exames' && (
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Exames</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2">Paciente</th>
                <th className="py-2">Data</th>
                <th className="py-2">Texto Extraído</th>
              </tr>
            </thead>
            <tbody>
              {exams.map(e => (
                <tr key={e._id} className="border-t">
                  <td className="py-2">{getPatientName(e.patientId)}</td>
                  <td className="py-2">{e.createdAt?.slice(0,10)}</td>
                  <td className="py-2 max-w-xs truncate" title={e.documentText}>{e.documentText?.slice(0, 60)}...</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'notificacoes' && (
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Notificações</h2>
          {notifications.length === 0 ? <p>Nenhuma notificação encontrada.</p> : (
            <ul>
              {notifications.map(n => (
                <li key={n._id} className="mb-2">{n.date} - {n.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === 'relatorios' && (
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Exportar Relatórios</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={exportCSV}>Exportar Consultas (CSV)</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
