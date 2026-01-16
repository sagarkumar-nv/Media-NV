'use client'

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

export default function Home() {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io("http://localhost:3001");

    socket.on("new-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.disconnect();
  }, []);

  const joinRoom = () => {
    socket.emit("join-room", { room, name });
    setJoined(true);
  };

  const sendMessage = () => {
    if (!message) return;
    socket.emit("send-message", { room, message });
    setMessage("");
  };

  return (
    <div className="h-screen bg-gradient-to-tr from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center">

      {!joined ? (
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-96 border border-white/20">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Join Chat
          </h2>

          <input
            className="w-full bg-white/20 text-white placeholder-white/60 border border-white/20 p-3 rounded-xl mb-4 focus:outline-none"
            placeholder="Room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />

          <input
            className="w-full bg-white/20 text-white placeholder-white/60 border border-white/20 p-3 rounded-xl mb-6 focus:outline-none"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            onClick={joinRoom}
            className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            Enter Chat
          </button>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-xl w-full max-w-md h-[650px] rounded-3xl shadow-2xl flex flex-col border border-white/20">

          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-t-3xl text-white">
            <h3 className="font-bold text-lg">{room}</h3>
            <p className="text-sm opacity-80">You: {name}</p>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.sender === name ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] shadow-lg text-sm ${
                    m.sender === name
                      ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-br-none"
                      : "bg-white/80 text-black rounded-bl-none"
                  }`}
                >
                  <p className="text-xs opacity-70 font-semibold">
                    {m.sender}
                  </p>
                  {m.message}
                </div>
              </div>
            ))}

          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/20 flex gap-2">
            <input
              className="flex-1 bg-white/20 text-white placeholder-white/60 border border-white/20 rounded-xl px-4 py-2 focus:outline-none"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-5 rounded-xl font-semibold hover:scale-105 transition"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
