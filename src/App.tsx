import React, { useState, useRef, useEffect } from "react";
import { useChat } from "./useChat";
import ChatMessageItem from "./chat";
import { themeColors } from "./theme";

const ChatBot: React.FC = () => {
  const { messages, loading, userName, sendMessage, resetUserName } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const colors = themeColors[theme]; // Colores del tema actual

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className={`fixed bottom-4 right-4 flex flex-col items-end z-50 ${colors.text}`}>
      {/* Bot de chat */}
      {isOpen && (
        <div className={`flex flex-col w-80 max-h-[500px] rounded-2xl shadow-xl border overflow-hidden ${colors.background} ${colors.border}`}>
          {/* Header */}
          <div className={`p-3 flex justify-between items-center shadow-2xl ring-2 ring-gray-400 rounded-t-2xl ${colors.headerBg} ${colors.headerText}`}>
            <span className="font-semibold">Alcaldía municipal de Yopal</span>
            <div className="flex gap-2 items-center">
              <button onClick={() => setIsOpen(false)}
               className={colors.closeBtn}
                >✘</button>
            </div>
          </div>

          {/* Mensajes */}
          <div className={`${colors.chatBg} flex-1 p-3 overflow-y-auto`}>
            {messages.map((m, i) => (
              <ChatMessageItem
                key={i}
                message={m}
                resetUserName={resetUserName}
                userName={userName ?? undefined}
                theme={theme} // ahora opcional, puedes quitarlo si usas contexto
              />
            ))}

            {loading && (
              <div className="flex mb-2 justify-start">
                <div className={`flex items-center max-w-xs px-3 py-2 rounded-2xl shadow border ${colors.loadingBubble}`}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span key={i} className="animate-bounce ml-1" style={{ animationDelay: `${i * 150}ms` }}>.</span>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`flex items-center gap-2 p-2 border-t ${colors.inputBg} ${colors.inputBorder}`}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className={`flex-1 border rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 ${colors.inputBg} ${colors.inputText} ${colors.inputBorder} ${colors.focusinput}`}
              placeholder={userName ? "Escribe tu mensaje..." : "Por favor, ingresa tu nombre"}
            />
            <button onClick={handleSend} className={`${colors.button} px-3 py-2 rounded-full transition`}>
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button onClick={() => setIsOpen(!isOpen)} className={`p-3 rounded-full shadow-lg hover:scale-110 transition ${colors.floatingBtn}`}>
        💬
      </button>
    </div>
  );
};

export default ChatBot;
