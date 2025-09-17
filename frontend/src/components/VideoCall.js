import React, { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import Tesseract from 'tesseract.js';

const VideoCall = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [documentText, setDocumentText] = useState('');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      });
  }, []);

  useEffect(() => {
    if (!localStream) return;
    const peer = new SimplePeer({ initiator: true, stream: localStream });
    peer.on('signal', data => {
      // Enviar sinal para o servidor
    });
    peer.on('stream', stream => {
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    });
    setTimeout(() => {
      // peer.signal(/* sinal recebido do servidor */);
    }, 1000);
  }, [localStream]);

  const scanDocument = async () => {
    try {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = localVideoRef.current.videoWidth;
      canvas.height = localVideoRef.current.videoHeight;
      context.drawImage(localVideoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/png');
      const result = await Tesseract.recognize(imageDataUrl, 'por');
      setDocumentText(result.data.text);
      await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: result.data.text })
      });
    } catch (error) {
      setDocumentText('Erro no reconhecimento.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow relative">
        <video ref={localVideoRef} autoPlay muted className="absolute top-4 left-4 w-48 h-36 object-cover rounded-lg border-4 border-blue-300" />
        <video ref={remoteVideoRef} autoPlay className="w-full h-full object-cover rounded-lg" />
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
          <button className="bg-red-500 text-white p-4 rounded-full text-2xl" aria-label="Desligar vídeo">
            <i className="fas fa-video"></i>
          </button>
          <button className="bg-blue-500 text-white p-4 rounded-full text-2xl" aria-label="Microfone">
            <i className="fas fa-microphone"></i>
          </button>
          <button onClick={scanDocument} className="bg-green-500 text-white p-4 rounded-full text-2xl" aria-label="Escanear documento">
            <i className="fas fa-camera"></i>
          </button>
        </div>
      </div>
      <div className="bg-white p-4 shadow-lg max-h-40 overflow-y-auto">
        <h3 className="font-bold mb-2">Texto Reconhecido:</h3>
        <pre className="text-lg">{documentText}</pre>
      </div>
    </div>
  );
};

export default VideoCall;
