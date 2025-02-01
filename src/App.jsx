import React from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChartForm";

import { useState, useRef } from "react";
import ChatMessage from "./components/ChatMessage";
import { useEffect } from "react";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [ndaGenerated, setNdaGenerated] = useState(false);
  const chatBodyRef = useRef();

  const NDA_TEMPLATE = (name, date) => `
MUTUAL NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement (the "Agreement") is entered into on ${date} by and between:

${name} ("Participant")
AND
[CHIL HYGIENE CENTER] ("Company")

1. Purpose
The purpose of this Agreement is to protect the confidential information shared between the Participant and the Company.

2. Confidential Information
"Confidential Information" includes any proprietary information, technical data, trade secrets, or know-how.

3. Term
This Agreement shall remain in effect from the date of execution.

4. Non-Disclosure
The Participant agrees to:
a) Keep all Confidential Information strictly confidential
b) Not use the Confidential Information for any purpose except as authorized
c) Not disclose any Confidential Information to any third party

Signed by:
${name}
Date: ${date}
`;

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

  const generateNDA = (name, date) => {
    const nda = NDA_TEMPLATE(name, date);
    setChatHistory((prev) => [
      ...prev,
      {
        role: "model",
        text: "I have generated your NDA. Please review it carefully:",
      },
      { role: "model", text: nda },
      {
        role: "model",
        text: "You can download the NDA or ask me any questions about it. What would you like to do?",
      },
    ]);
    setNdaGenerated(true);
  };

  const handleDownload = () => {
    const nda = NDA_TEMPLATE(userDetails.name, userDetails.date);
    const blob = new Blob([nda], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NDA_${userDetails.name}_${userDetails.date}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setChatHistory((prev) => [
      ...prev,
      {
        role: "model",
        text: "The NDA has been downloaded. Is there anything else you'd like to know about the NDA?",
      },
    ]);
  };

  const generateGeminiResponse = async (history) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: history.map(({ role, text }) => ({
          role,
          parts: [{ text }],
        })),
      }),
    };

    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong");

      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();

      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text: apiResponseText },
      ]);
    } catch (error) {
      console.log(error);
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        {
          role: "model",
          text: "I apologize, but I encountered an error. Please try again.",
        },
      ]);
    }
  };

  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <div className="container">
      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">CHIL HYGIENE NDA CHATBOT</h2>
          </div>
          {ndaGenerated && (
            <button
              onClick={handleDownload}
              className="download-button"
              title="Download NDA"
            >
              <span className="material-symbols-rounded">download</span>
            </button>
          )}
        </div>

        {/* Chatbot Body */}
        <div ref={chatBodyRef} className="chat-body">
          {!userDetails ? (
            <div className="nda-form-container">
              <div className="nda-form-header">
                <ChatbotIcon />
                <h2 className="nda-form-title">NDA Details</h2>
              </div>

              <form onSubmit={handleInitialSubmit}>
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
                  <input
                    type="date"
                    name="date"
                    required
                    className="form-input"
                  />
                </div>

                <button type="submit" className="submit-button">
                  Start NDA Process
                </button>
              </form>
            </div>
          ) : (
            <>
              {chatHistory.map((chat, index) => (
                <ChatMessage key={index} chat={chat} />
              ))}
            </>
          )}
        </div>

        {/* Chatbot Footer */}
        <div className="chat-footer">
          {userDetails && (
            <ChatForm
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              generateBotResponse={(history) => {
                const lastMessage =
                  history[history.length - 1].text.toLowerCase();

                // Add "Thinking..." message
                setChatHistory((prev) => [
                  ...prev,
                  { role: "model", text: "Thinking..." },
                ]);

                if (!ndaGenerated && lastMessage.includes("yes")) {
                  generateNDA(userDetails.name, userDetails.date);
                } else if (ndaGenerated) {
                  // Use Gemini API for follow-up questions
                  generateGeminiResponse(history);
                } else {
                  setChatHistory((prev) => [
                    ...prev.filter((msg) => msg.text !== "Thinking..."),
                    {
                      role: "model",
                      text: "Would you like me to generate the NDA now?",
                    },
                  ]);
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
