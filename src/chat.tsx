import React from "react";
import { ChatMessage } from "./useChat";


interface MessageProps {
  message: ChatMessage;
  resetUserName?: () => void;
  userName?: string;
  theme?: "light" | "dark"; // nuevo prop
}

const ChatMessageItem: React.FC<MessageProps> = ({ message, resetUserName, userName, theme = "light" }) => {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  const containerClasses = `flex mb-2 transition-all duration-300 ${isUser ? "justify-end" : "justify-start"}`;

  const bubbleClasses = `flex flex-col gap-1 max-w-xs px-3 py-2 rounded-2xl shadow ${
    isUser
      ? `${theme === "dark" ? "bg-red-700 text-white" : "bg-[#078930] text-white"} rounded-br-none animate-fadeIn`
      : isSystem
      ? `${theme === "dark" ? "bg-red-700 text-red-200 border-red-600" : "bg-red-100 text-red-800 border border-red-400"} rounded-md animate-fadeIn ${message.isFading ? "animate-fadeOut" : ""}`
      : `${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border"} rounded-bl-none animate-fadeIn`
  }`;

  return (
    <div className={containerClasses}>
      <div className={bubbleClasses}>
        {message.id === "welcome-with-name" ? (
          <p className="text-sm opacity-90">{message.content}</p>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: parseTextToHtml(message.content) }} />
        )}

        {message.id === "welcome-with-name" && resetUserName && userName && (
          <button
            onClick={resetUserName}
            className="text-xs text-blue-400 underline mt-1 self-start hover:text-blue-600 transition"
          >
            ¡No soy {userName}!
          </button>
        )}
      </div>
    </div>
  );
};


// Función para convertir texto plano en HTML con títulos en negrita, listas y saltos automáticos
function parseTextToHtml(text: string): string {
  const lines = text.split("\n");
  let html = "";
  let olOpen = false;
  let ulOpen = false;

  const closeLists = () => {
    if (olOpen) { html += "</ol>"; olOpen = false; }
    if (ulOpen) { html += "</ul>"; ulOpen = false; }
  };

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return; // saltar líneas vacías

    const olMatch = trimmed.match(/^\d+\.\s+(.*)/);       // lista numerada
    const ulMatch = trimmed.match(/^\-\s+(.*)/);          // lista desordenada
    const boldTitleMatch = trimmed.match(/^(.+):$/);      // línea que termina en ":" como título

    if (olMatch) {
      closeLists();
      html += `<ol style="margin-top: 1em;"><li><strong>${olMatch[1]}</strong></li></ol>`;
    } else if (ulMatch) {
      if (!ulOpen) { html += '<ul style="margin-top: 1em;">'; ulOpen = true; }
      html += `<li>${ulMatch[1]}</li>`;
    } else if (boldTitleMatch) {
      closeLists();
      html += `<p style="margin-top: 1em;"><strong>${boldTitleMatch[1]}</strong></p>`;
    } else {
      closeLists();
      html += `<p style="margin-top: 0.5em;">${trimmed}</p>`;
    }
  });

  closeLists();
  return html;
}


export default ChatMessageItem;
