import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/patients')
      .then(res => res.json())
      .then(data => {
        setPatients(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao carregar pacientes.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Carregando pacientes...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="bg-white rounded shadow p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Pacientes Cadastrados</h2>
      {patients.length === 0 ? (
        <p>Nenhum paciente cadastrado.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2">Nome</th>
              <th className="py-2">CPF</th>
              <th className="py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="py-2">{p.name}</td>
                <td className="py-2">{p.cpf}</td>
                <td className="py-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => navigate(`/edit-patient/${p._id}`)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientList;
