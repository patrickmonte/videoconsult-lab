import React, { useState } from 'react';

const PatientForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    birthDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Cadastro realizado com sucesso!');
        if (onSuccess) onSuccess();
      } else {
        setError('Erro ao cadastrar. Verifique os dados.');
      }
    } catch {
      setError('Erro de conexão.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Pré-cadastro do Paciente</h2>
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
        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required className="w-full px-3 py-3 border rounded text-lg" />
      </div>
      {error && <div className="text-red-600 mb-2 text-center">{error}</div>}
      <button type="submit" className="bg-blue-600 text-white w-full py-3 rounded text-xl font-bold mt-2" disabled={loading}>
        {loading ? 'Enviando...' : 'Cadastrar'}
      </button>
    </form>
  );
};

export default PatientForm;
