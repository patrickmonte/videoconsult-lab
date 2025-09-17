import React, { useRef, useState } from 'react';
import Tesseract from 'tesseract.js';

const DocumentScanner = ({ onTextExtracted }) => {
  const fileInputRef = useRef();
  const [preview, setPreview] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      setPreview(ev.target.result);
      setLoading(true);
      const result = await Tesseract.recognize(ev.target.result, 'por');
      setOcrText(result.data.text);
      setLoading(false);
      if (onTextExtracted) onTextExtracted(result.data.text);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="my-4">
      <input type="file" accept="image/*,.pdf" ref={fileInputRef} onChange={handleFileChange} className="mb-2" />
      {preview && (
        <div className="mb-2">
          <img src={preview} alt="Preview" className="max-h-48 border rounded" />
        </div>
      )}
      {loading && <div className="text-blue-600">Reconhecendo texto...</div>}
      {ocrText && (
        <div className="bg-gray-100 p-2 rounded mt-2">
          <strong>Texto extraído:</strong>
          <pre className="text-sm whitespace-pre-wrap">{ocrText}</pre>
        </div>
      )}
    </div>
  );
};

export default DocumentScanner;
