import React, { useState, useRef, useEffect } from "react";
import { useChat, ChatMessage } from "./useChat";
import './index.css';

// --- Iconos ---
const ChatbotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
  </svg>
);

// --- Loading ---
const LoadingMessage = () => (
  <div className="flex items-center text-gray-500">
    <span>Escribiendo</span>
    <span className="animate-bounce ml-1">.</span>
    <span className="animate-bounce ml-1" style={{ animationDelay: "150ms" }}>.</span>
    <span className="animate-bounce ml-1" style={{ animationDelay: "300ms" }}>.</span>
  </div>
);

export default function ChatBot() {
  const { messages, setMessages, sendMessage, loading, userName, setUserName } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Scroll al final de los mensajes ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // --- Enviar mensaje ---
  const handleSend = async () => {
    if (!input.trim()) return;

    // Pedir nombre si aún no hay
    if (!userName) {
      const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,30}$/;
      if (!nameRegex.test(input.trim())) {
        setMessages(prev => [
          ...prev,
          { role: "system", content: "Por favor, ingresa un nombre válido (solo letras)." }
        ]);
        setInput("");
        return;
      }

      // Guardar nombre
      const trimmedName = input.trim();
      setUserName(trimmedName);
      localStorage.setItem("chat_user_name", trimmedName);

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `¡Encantado de conocerte, ${trimmedName}! ¿En qué puedo ayudarte hoy?` }
      ]);
      setInput("");
      return;
    }

    // Validar lenguaje respetuoso
    const forbiddenWords = ["hp", "hijueputa", "gonorrea", "malparido"];
    if (forbiddenWords.some(word => input.toLowerCase().includes(word))) {
      setMessages(prev => [
        ...prev,
        { role: "system", content: "⚠️ Por favor, mantén un lenguaje respetuoso." }
      ]);
      setInput("");
      return;
    }

    // Enviar mensaje al backend
    await sendMessage(input);
    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      {isOpen && (
        <div className="flex flex-col w-80 max-h-[500px] bg-white rounded-2xl shadow-xl border overflow-hidden">
          
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
            <span className="font-semibold">Alcaldía municipal de Yopal</span>
            <button onClick={() => setIsOpen(false)} className="text-xl">✖</button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-100">
            {messages.map((m: ChatMessage, i: number) => (
              <div key={i} className={`flex mb-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-start gap-1 max-w-xs px-3 py-2 rounded-2xl shadow 
                  ${m.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : m.role === "system"
                      ? "bg-red-100 text-red-800 border border-red-400 rounded-md"
                      : "bg-white text-gray-800 rounded-bl-none border"}`}>
                  {m.role === "assistant" && m.content !== "loading" && <ChatbotIcon />}
                  {m.role === "user" && <UserIcon />}
                  <div>{m.content === "loading" ? <LoadingMessage /> : m.content}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
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

      {/* Botón de abrir/cerrar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-green-600 text-white rounded-full shadow-lg hover:scale-110 transition"
      >
        💬
      </button>
    </div>
  );
}
