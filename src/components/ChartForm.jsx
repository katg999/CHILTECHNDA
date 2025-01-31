import React from "react";
const ChatForm = () => {
  return (
    <form action="" className="chat-form">
      <input
        type="text"
        placeholder="message..."
        className="message-input"
        required
      />
      <button class="material-symbols-rounded">arrow_upward</button>
    </form>
  );
};

export default ChatForm;
