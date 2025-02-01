import React from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChartForm";
import { useState, useRef } from "react";
import ChatMessage from "./components/ChatMessage";
import { useEffect } from "react";

const App = () => {
  //Helper function to update chat history
  const updateHistory = (text) => {
    setChatHistory((prev) => [
      ...prev.filter((msg) => msg.text !== "Thinking..."),
      { role: "model", text },
    ]);
  };

  const [chatHistory, setChatHistory] = useState([]);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    //Format chat history for API request
    history = history.map(({ role, text }) => ({
      role,
      parts: [{ text }],
    }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };
    try {
      //Making the API call get the bots response

      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong");

      //Claena nd update chat history with bots respose
      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();
      updateHistory(apiResponseText);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    //Aut0-scroll whenever chat hsitory is updated
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behaviour: "smooth",
    });
  }, [chatHistory]);

  return (
    <div className="container">
      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />

            <h2 className="logo-text">Chatbot</h2>
          </div>

          <button className="material-symbols-rounded">
            keyboard_arrow_down
          </button>
        </div>
        {/* Chatbot Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey there 💛 <br />
              How can I help you today?
            </p>
          </div>
          {/* Rendering the chat history dynamically */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>
        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};
export default App;
