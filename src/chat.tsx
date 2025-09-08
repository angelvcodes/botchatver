import React from "react";
import { ChatMessage } from "./useChat";
import { themeColors } from "./theme";

interface MessageProps {
  message: ChatMessage;
  resetUserName?: () => void;
  userName?: string;
  theme?: "light" | "dark"; // Tema actual
}

const ChatMessageItem: React.FC<MessageProps> = ({
  message,
  resetUserName,
  userName,
  theme = "light",
}) => {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  const colors = themeColors[theme]; // Obtenemos todas las clases del tema

  // Contenedor de la burbuja
  const containerClasses = `flex mb-2 transition-all duration-300 ${
    isUser ? "justify-end" : "justify-start"
  }`;

  // Burbujas según tipo de mensaje
  let bubbleClasses = "flex flex-col gap-1 max-w-xs px-3 py-1 rounded-2xl shadow";
  if (isUser) bubbleClasses += ` ${colors.userBubble}`;
  else if (isSystem) bubbleClasses += ` ${colors.systemBubble} ${message.isFading ? "animate-fadeOut" : ""}`;
  else bubbleClasses += ` ${colors.botBubble}`;

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

// Función para convertir texto plano a HTML (listas, títulos, saltos de línea)
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
    if (!trimmed) return;

    const olMatch = trimmed.match(/^\d+\.\s+(.*)/);
    const ulMatch = trimmed.match(/^\-\s+(.*)/);
    const boldTitleMatch = trimmed.match(/^(.+):$/);

    if (olMatch) {
      closeLists();
      html += `<ol style="margin-top: 1em;"><li><strong>${olMatch[1]}</strong></li></ol>`;
    } else if (ulMatch) {
      if (!ulOpen) html += '<ul style="margin-top:1em;">';

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
