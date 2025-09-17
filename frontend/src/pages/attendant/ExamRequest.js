import React, { useState } from 'react';
import DocumentScanner from '../components/DocumentScanner';

const ExamRequest = ({ patientId, onExamCreated }) => {
  const [documentText, setDocumentText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patientId,
          documentText,
        })
      });
      if (res.ok) {
        setSuccess(true);
        setDocumentText('');
        setFile(null);
        if (onExamCreated) onExamCreated();
      } else {
        setError('Erro ao enviar exame.');
      }
    } catch {
      setError('Erro de conexão.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h3 className="text-lg font-bold mb-2">Solicitar/Enviar Exame</h3>
      <DocumentScanner onTextExtracted={setDocumentText} />
      {documentText && (
        <div className="mt-2 p-2 bg-gray-100 rounded">
          <span className="font-semibold">Texto extraído:</span>
          <pre className="text-xs whitespace-pre-wrap">{documentText}</pre>
        </div>
      )}
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {success && <div className="text-green-600 mt-2">Exame enviado!</div>}
      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded mt-4" disabled={loading || !documentText}>
        {loading ? 'Enviando...' : 'Enviar Exame'}
      </button>
    </form>
  );
};

export default ExamRequest;
