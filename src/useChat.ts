import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  id?: string;
  isFading?: boolean; // para fadeOut
}

export function useChat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    let storedSession = localStorage.getItem("chat_session_id");
    if (!storedSession) {
      storedSession = uuidv4();
      localStorage.setItem("chat_session_id", storedSession);
    }
    setSessionId(storedSession);

    const storedName = localStorage.getItem("chat_user_name");
    setMessages([]);

    if (storedName) {
      setUserName(storedName);
      setMessages([
        { role: "assistant", content: `¡Hola de nuevo, ${storedName}!`, id: "welcome-with-name" }
      ]);
    } else {
      setMessages([
        { role: "assistant", content: "👋 ¡Hola! ¡Qué gusto tenerte aquí! Soy Cecilia, ¿Cuál es tu nombre?" }
      ]);
    }
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !sessionId) return;

    if (!userName) {
      const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,30}$/;
      if (!nameRegex.test(text.trim())) {
        const sysMsg: ChatMessage = { role: "system", content: "Por favor, ingresa un nombre válido (solo letras).", id: uuidv4() };
        setMessages(prev => [...prev, sysMsg]);
        setTimeout(() => {
          setMessages(prev => prev.filter(m => m.id !== sysMsg.id));
        }, 5000);
        return;
      }

      const trimmedName = text.trim();
      setUserName(trimmedName);
      localStorage.setItem("chat_user_name", trimmedName);

      setMessages(prev => [
        ...prev,
        { role: "user", content: trimmedName },
        { role: "assistant", content: `¡Encantada de conocerte, ${trimmedName}! ¿En qué puedo ayudarte hoy?` }
      ]);
      return;
    }

    const forbiddenWords = ["hp", "hijueputa", "gonorrea", "malparido", "puta","prostituta"];
    if (forbiddenWords.some(word => text.toLowerCase().includes(word))) {
      const sysMsg: ChatMessage = { role: "system", content: "⚠️ Por favor, mantén un lenguaje respetuoso.", id: uuidv4() };
      setMessages(prev => [...prev, sysMsg]);

      // FadeOut
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.id === sysMsg.id ? { ...m, isFading: true } : m));
      }, 4000);

      // Eliminar después de animación
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== sysMsg.id));
      }, 4500);

      return;
    }

    setMessages(prev => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: text })
      });
      const data = await res.json();

      setMessages(prev => [...prev, { role: "assistant", content: data.textResponse }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Error al conectar con el servidor." }]);
    } finally {
      setLoading(false);
    }
  };

  const resetUserName = () => {
    setUserName(null);
    localStorage.removeItem("chat_user_name");
    setMessages([{ role: "assistant", content: "👋 ¡Hola! ¡Qué gusto tenerte aquí! Soy Cecilia, ¿Cuál es tu nombre?" }]);
  };

  return { messages, setMessages, sendMessage, loading, userName, resetUserName };
}
