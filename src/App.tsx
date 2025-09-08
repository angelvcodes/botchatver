import React, { useState, useRef, useEffect } from "react";
import { useChat } from "./useChat";
import ChatMessageItem from "./chat";

const ChatBot: React.FC = () => {
  const { messages, loading, userName, sendMessage, resetUserName } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");//tema variable global
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
    <div className={`fixed bottom-4 right-4 flex flex-col items-end z-50 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
      {/* Bot de chat */}
      {isOpen && (
        <div className={`flex flex-col w-80 max-h-[500px] rounded-2xl shadow-xl border overflow-hidden
                        ${theme === "dark" ? "bg-gray-00 border-gray-700" : "bg-white border-gray-200"}`}>
          
         {/* Header */}
       <div className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-black"} 
                p-3 flex justify-between items-center 
                shadow-2xl ring-2 ring-gray-400 rounded-t-2xl`}>
       <span className="font-semibold">Alcaldía municipal de Yopal</span>
       <div className="flex gap-2 items-center">
         <button onClick={() => setIsOpen(false)}>✖</button>
       </div>
     </div>



          {/* Mensajes */}
          <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} flex-1 p-3 overflow-y-auto`}>
            {messages.map((m, i) => (
              <ChatMessageItem
                key={i}
                message={m}
                resetUserName={resetUserName}
                userName={userName ?? undefined}
                theme={theme} // pasar el tema a cada mensaje
              />
            ))}
            {loading && (
            <div className="flex mb-2 justify-start">
              <div className={`flex items-center max-w-xs px-3 py-2 rounded-2xl shadow border 
                              ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"} animate-fadeIn`}>
                
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className="animate-bounce ml-1" style={{ animationDelay: `${i * 150}ms` }}>.</span>
                ))}
              </div>
            </div>
          )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`flex items-center gap-2 p-2 border-t ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}bg-gray-800
              className={`flex-1 border rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 
                          ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white focus:ring-gray-500" 
                                             : "bg-white border-gray-300 text-gray-900 focus:ring-green-700"}`}
              placeholder={userName ? "Escribe tu mensaje..." : "Por favor, ingresa tu nombre"}
            />
            <button
              onClick={handleSend}
              className={`${theme === "dark" ? "bg-[#DA121A] hover:bg-red-600 text-white" : "bg-[#078930] hover:bg-green-600 text-white"} px-3 py-2 rounded-full transition`}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-full shadow-lg hover:scale-110 transition
                    ${theme === "dark" ? "bg-gray-800 text-white" : "bg-[#078930] text-white"}`}
      >
        💬
      </button>
    </div>
  );
};

export default ChatBot;
