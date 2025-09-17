import React from 'react';
import { useParams } from 'react-router-dom';
import Chat from '../../components/Chat';

const ChatRoom = () => {
  const { roomId } = useParams();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Chat da Consulta</h2>
        <Chat roomId={roomId} sender="attendant" />
      </div>
    </div>
  );
};

export default ChatRoom;
