import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ExamRequest from './ExamRequest';

const PatientHistory = () => {
  const { patientId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/appointments').then(res => res.json()),
      fetch('/api/exams').then(res => res.json())
    ]).then(([apps, exs]) => {
      setAppointments(apps.filter(a => a.patientId === patientId));
      setExams(exs.filter(e => e.patientId === patientId));
      setLoading(false);
    });
  }, [patientId]);

  if (loading) return <div>Carregando histórico...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Histórico do Paciente</h1>
      <div className="bg-white rounded shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Consultas</h2>
        {appointments.length === 0 ? <p>Nenhuma consulta encontrada.</p> : (
          <ul>
            {appointments.map(a => (
              <li key={a._id}>{a.date} às {a.time} - {a.status}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="bg-white rounded shadow p-6 mb-6">
        <ExamRequest patientId={patientId} onExamCreated={() => {
          // Atualiza lista de exames após novo upload
          fetch('/api/exams').then(res => res.json()).then(exs => {
            setExams(exs.filter(e => e.patientId === patientId));
          });
        }} />
      </div>
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-bold mb-4">Exames</h2>
        {exams.length === 0 ? <p>Nenhum exame encontrado.</p> : (
          <ul>
            {exams.map(e => (
              <li key={e._id}>{e.createdAt?.slice(0,10)} - {e.documentText?.slice(0, 60)}...</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PatientHistory;
