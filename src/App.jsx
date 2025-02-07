import React from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChartForm";

import { useState, useRef } from "react";
import ChatMessage from "./components/ChatMessage";
import { useEffect } from "react";
import Signature from "./components/Signature";

import { generateNDATemplate } from "./utils/ndaUtils"; // Externalized NDA template function

const App = () => {
  // State Management
  const [chatHistory, setChatHistory] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [ndaGenerated, setNdaGenerated] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const chatBodyRef = useRef();

  // Handles form submission to collect user details
  const handleInitialSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const date = e.target.date.value;

    setUserDetails({ name, date });
    setChatHistory([
      {
        role: "model",
        text: `Welcome ${name}! I'll help you generate and manage your NDA. Would you like me to create the NDA now?`,
      },
    ]);
  };

  // Generates NDA and updates chat history
const generateNDA = () => {
  const { name, date } = userDetails;
  const ndaContent = generateNDATemplate(name, date, null, "text"); // Plain text for chatbot

  setChatHistory((prev) => [
    ...prev,
    {
      role: "model",
      text: "I have generated your NDA. Please review it carefully:",
    },
    { role: "model", text: ndaContent }, // Plain text version
    { role: "model", text: "Please sign below to proceed." },
  ]);

  setNdaGenerated(true);
};


  // Handles signature saves
  const handleSignatureSave = (signature) => {
    setSignatureData(signature);
    setChatHistory((prev) => [
      ...prev,
      {
        role: "model",
        text: "Signature saved successfully! You can now download the NDA.",
      },
    ]);
  };

  // Handles NDA download
   const handleDownload = () => {
  if (!signatureData) {
    alert("Please sign the NDA before downloading.");
    return;
  }

  const { name, date } = userDetails;
  const ndaContent = generateNDATemplate(name, date, signatureData, "html"); // HTML for download

  const blob = new Blob([ndaContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `NDA_${name}_${date}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  setChatHistory((prev) => [
    ...prev,
    {
      role: "model",
      text: "The NDA has been downloaded with your signature. Is there anything else you need?",
    },
  ]);
};


  // Scroll to latest message in chat
  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (

    <div className="container">
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">KETI AI NDA CHATBOT</h2>
          </div>
          {ndaGenerated && signatureData && (
            <button
              onClick={handleDownload}
              className="download-button"
              title="Download NDA"
            >
              <span className="material-symbols-rounded">download</span>
            </button>
          )}
        </div>

        <div ref={chatBodyRef} className="chat-body">
          {!userDetails ? (
            <NDAForm onSubmit={handleInitialSubmit} />
          ) : (
            <>
              {chatHistory.map((chat, index) => (
                <ChatMessage key={index} chat={chat} />
              ))}
              {ndaGenerated && !signatureData && (
                <Signature onSave={handleSignatureSave} />
              )}
            </>
          )}
        </div>

        <div className="chat-footer">
          {userDetails && (
            <ChatForm
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              generateBotResponse={(history) => {
                const lastMessage =
                  history[history.length - 1].text.toLowerCase();
                setChatHistory((prev) => [
                  ...prev,
                  { role: "model", text: "Thinking..." },
                ]);

                if (!ndaGenerated && lastMessage.includes("yes")) {
                  generateNDA();
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// NDA Form Component
const NDAForm = ({ onSubmit }) => (
  <div className="nda-form-container">
    <div className="nda-form-header">
      <ChatbotIcon />
      <h2 className="nda-form-title">NDA Details</h2>
    </div>

    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label className="form-label">Your Full Name</label>
        <input
          type="text"
          name="name"
          required
          className="form-input"
          placeholder="Enter your full name"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Date</label>
        <input type="date" name="date" required className="form-input" />
      </div>

      <button type="submit" className="submit-button">
        Start NDA Process
      </button>
    </form>
  </div>
);

export default App;