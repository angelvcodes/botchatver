import { useState } from "react";
import { useChat } from "./useChat";

export default function ChatWindow() {
  const { messages, setMessages, loading, sendMessage } = useChat();


  const [input, setInput] = useState("");

  const handleSend = async () => {
    await sendMessage(input);
    setInput(""); // 👈 limpia el cuadro después de enviar
  };

  return (
    <div className="flex flex-col w-[400px] h-[600px] mx-auto my-10 border rounded-2xl shadow-lg bg-white">
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[75%] ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-black self-start mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <p className="text-gray-500 italic">Escribiendo...</p>
        )}
      </div>

      {/* Input de envío */}
      <div className="p-3 border-t flex">
        <input
          className="flex-1 border rounded-xl px-3 py-2 mr-2 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
          onClick={handleSend}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
