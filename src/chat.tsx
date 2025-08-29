import React from "react";
import { ChatMessage } from "./useChat";

interface MessageProps {
  message: ChatMessage;
  resetUserName?: () => void;
}

const ChatMessageItem: React.FC<MessageProps> = ({ message, resetUserName }) => {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  const containerClasses = `flex mb-2 transition-all duration-300 ${isUser ? "justify-end" : "justify-start"}`;

  const bubbleClasses = `flex flex-col gap-1 max-w-xs px-3 py-2 rounded-2xl shadow ${
  isUser
    ? "bg-blue-600 text-white rounded-br-none animate-fadeIn"
    : isSystem
    ? `bg-red-100 text-red-800 border border-red-400 rounded-md animate-fadeIn ${message.isFading ? "animate-fadeOut" : ""}`
    : "bg-white text-gray-800 rounded-bl-none border animate-fadeIn"
}`;

  return (
    <div className={containerClasses}>
      <div className={bubbleClasses}>
        <p className={message.id === "welcome-with-name" ? "text-sm opacity-90" : ""}>
          {message.content}
        </p>

        {message.id === "welcome-with-name" && resetUserName && (
          <button
            onClick={resetUserName}
            className="text-xs text-blue-600 underline mt-1 self-start hover:text-blue-800 transition"
          >
            ¡No soy yo!
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatMessageItem;
