import "./Message.css";
import { useState, useEffect } from "react";
import mockMessageData from "./mockMessageData.json";
import * as APIRoutes from "../../../../utils/APIRoutes";
import sendArrow from "../../../../assets/sendArrow.svg";
import { format } from "date-fns";

function Message({ setSelectedFriend, userEmail }) {
  const [messages, setMessages] = useState(mockMessageData);
  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // integrate API later, for now console.log
      console.log(messageInput);

      // Clear the message input after sending
      setMessageInput("");

    } else {
      console.log("No message to send");
    }
  };

  // Fetch messages from the API and USER
  let chosenMessages;
  if (setSelectedFriend) {
    chosenMessages = messages.find(
      (message) => message.id === setSelectedFriend
    );
    console.log("Chosen Messages: ", chosenMessages);
  }

  // Helper function to format the datetime
  const formatTimestamp = (timestamp) => {
    // Parses the ISO string and formats it, e.g., 'HH:mm'
    return format(new Date(timestamp), "HH:mm");
  };

// Combine and sort messages by timestamp
const combinedMessages = (chosenMessages?.messages ?? [])
  .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));

  return (
    <div className="message-container">
      <p className="subheading">message with</p>
      <p className="heading">{setSelectedFriend}</p>
      <div className="messages-list">
        {combinedMessages.map((messageObject, index) => (
          <div key={index} className={`${messageObject.type}-container`}>
            <span className="message-text">{messageObject.text}</span>
            <span className="message-timestamp">{formatTimestamp(messageObject.timestamp)}</span>
          </div>
        ))}
      </div>
      <div className="send-bar fxr">
        <input
          type="text"
          className="message-input"
          placeholder="type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <button className="send-button" onClick={handleSendMessage}>
          <img src={sendArrow} alt="send" className="send-icon" />
        </button>
      </div>
    </div>
  );
}

export default Message;
