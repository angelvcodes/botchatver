import React, { useState, useRef, useEffect } from "react";
import { useChat } from "./useChat";
import ChatMessageItem from "./chat";

const ChatBot: React.FC = () => {
  const { messages, loading, userName, sendMessage, resetUserName } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      {isOpen && (
        <div className="flex flex-col w-80 max-h-[500px] bg-white rounded-2xl shadow-xl border overflow-hidden">
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <span className="font-semibold">Alcaldía municipal de Yopal</span>
            <button onClick={() => setIsOpen(false)} className="text-xl">✖</button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto bg-gray-100">
            {messages.map((m, i) => (
              <ChatMessageItem key={i} message={m} resetUserName={resetUserName} />
            ))}
            {loading && (
              <div className="flex mb-2 justify-start">
                <div className="flex items-center gap-1 max-w-xs px-3 py-2 bg-white text-gray-800 rounded-bl-none border animate-fadeIn">
                  <span>Escribiendo</span>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span key={i} className="animate-bounce ml-1" style={{ animationDelay: `${i * 150}ms` }}>.</span>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center gap-2 p-2 border-t bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 border rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder={userName ? "Escribe tu mensaje..." : "Por favor, ingresa tu nombre"}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-3 py-2 rounded-full hover:bg-blue-700 transition"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-green-600 text-white rounded-full shadow-lg hover:scale-110 transition"
      >
        💬
      </button>
    </div>
  );
};

export default ChatBot;
