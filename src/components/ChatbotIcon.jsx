import React, { useState } from 'react';
import chatbotImage from './KETI AI.jpeg';

const ChatbotIcon = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="chatbot-icon-container">
      {!imageError ? (
        <img
          src={chatbotImage}
          alt="Chatbot Icon"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="text-xs text-red-500">Image Error</div>
      )}
    </div>
  );
};

export default ChatbotIcon;
