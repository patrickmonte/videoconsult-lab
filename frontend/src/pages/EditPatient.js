import React, { useState, useEffect } from 'react';

const EditPatient = ({ patientId }) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/patients/${patientId}`)
      .then(res => res.json())
      .then(data => {
        setFormData(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Erro ao carregar dados do paciente.');
        setLoading(false);
      });
  }, [patientId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSuccess(true);
      } else {
        setError('Erro ao atualizar dados.');
      }
    } catch {
      setError('Erro de conexão.');
    }
    setLoading(false);
  };

  if (loading) return <div>Carregando...</div>;
  if (!formData) return <div>Paciente não encontrado.</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Editar Paciente</h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Nome Completo</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-3 border rounded text-lg" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">CPF</label>
        <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required className="w-full px-3 py-3 border rounded text-lg" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">E-mail</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-3 border rounded text-lg" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Telefone</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-3 py-3 border rounded text-lg" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Data de Nascimento</label>
        <input type="date" name="birthDate" value={formData.birthDate?.slice(0,10)} onChange={handleChange} required className="w-full px-3 py-3 border rounded text-lg" />
      </div>
      {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
      {success && <div className="text-green-600 mb-2 text-center">Dados atualizados com sucesso!</div>}
      <button type="submit" className="bg-blue-600 text-white w-full py-3 rounded text-xl font-bold mt-2" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </button>
    </form>
  );
};

export default EditPatient;
