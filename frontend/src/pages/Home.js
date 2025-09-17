import React from 'react';
import PatientForm from '../components/PatientForm';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-50">
      <div className="w-full max-w-lg">
        <PatientForm onSuccess={() => navigate('/appointment')} />
      </div>
      <div className="mt-8 text-center text-gray-600 text-lg">
        <p>Bem-vindo ao sistema de vídeoconsulta para exames laboratoriais.</p>
        <p className="mt-2">Preencha o pré-cadastro para iniciar seu atendimento.</p>
      </div>
    </div>
  );
};

export default Home;
