import React, { useEffect, useRef, useState } from 'react';

const Chat = ({ roomId, sender }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch(`/api/chat/${roomId}`)
      .then(res => res.json())
      .then(data => {
        setMessages(data);
        setLoading(false);
      });
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const res = await fetch(`/api/chat/${roomId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender, content: input })
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages([...messages, msg]);
      setInput('');
    }
  };

  if (loading) return <div>Carregando chat...</div>;

  return (
    <div className="flex flex-col h-80 border rounded bg-white">
      <div className="flex-1 overflow-y-auto p-2">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.sender === sender ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-1 rounded ${m.sender === sender ? 'bg-blue-200' : 'bg-gray-200'}`}>{m.content}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex p-2 border-t">
        <input
          className="flex-1 border rounded px-2 py-1 mr-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <button className="bg-blue-600 text-white px-4 py-1 rounded" type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Chat;
