import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export function useChat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "👋 Hola, soy tu asistente. ¿En qué te ayudo hoy?" }
  ]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  // Al iniciar, generamos sessionId y cargamos userName de localStorage
  useEffect(() => {
    let storedSession = localStorage.getItem("chat_session_id");
    if (!storedSession) {
      storedSession = uuidv4();
      localStorage.setItem("chat_session_id", storedSession);
    }
    setSessionId(storedSession);

    const storedName = localStorage.getItem("chat_user_name");
    if (storedName) {
      setUserName(storedName);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `¡Hola de nuevo, ${storedName}! ¿En qué puedo ayudarte hoy?` }
      ]);
    }
  }, []);

  async function sendMessage(text: string) {
    if (!text.trim() || !sessionId) return;

    setMessages(prev => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text }),
      });
      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.textResponse },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "⚠️ Error al conectar con el servidor." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return { messages, setMessages, sendMessage, loading, userName, setUserName };
}
