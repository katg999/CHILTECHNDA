import React from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChartForm";

const App = () => {
  return (
    <div className="container">
      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />

            <h2 className="logo-text">Chatbot</h2>
          </div>

          <button class="material-symbols-rounded">keyboard_arrow_down</button>
        </div>
        {/* Chatbot Body */}
        <div className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey there 💛 <br />
              How can I help you today?
            </p>
          </div>
          <div className="message user-message">
            {/* <ChatbotIcon /> */}
            <p className="message-text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
              quae sed neque cupiditate officiis vel deserunt suscipit voluptate
              quisquam ipsam odio quis optio totam itaque architecto, similique
              voluptas dolorem commodi.
            </p>
          </div>
        </div>
        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatForm />
        </div>
      </div>
    </div>
  );
};
export default App;
