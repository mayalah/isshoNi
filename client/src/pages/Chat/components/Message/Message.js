import "./Message.css";
import { useState, useEffect } from "react";
import * as APIRoutes from "../../../../utils/APIRoutes";
import sendArrow from "../../../../assets/sendArrow.svg";
import { format } from "date-fns";
import axios from "axios";

function Message({ setSelectedFriend, userEmail, friendEmail }) {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sortedMessages, setSortedMessages] = useState([]);

  useEffect(() => {
    axios
      .post(APIRoutes.getMessages, {
        userEmail: userEmail,
        friendEmail: friendEmail,
        message_id: "",
      })
      .then((response) => {
        setMessages(response.data);
        const sortedMessages = response.data.sort((a, b) => {
          return new Date(a.time) - new Date(b.time);
        });
        setSortedMessages(sortedMessages);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, [friendEmail]);

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

  const formatTimestamp = (dateString, timeString) => {

    // Extract the hours, minutes, and seconds from the time string
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes, seconds] = time.split(':');
    
    // Convert 12-hour time to 24-hour time
    hours = parseInt(hours, 10);
    hours = (modifier === 'PM' && hours !== 12) ? hours + 12 : hours;
    hours = (modifier === 'AM' && hours === 12) ? 0 : hours;
  
    const combinedDateTimeString = `${dateString} ${hours}:${minutes}:${seconds}`;
    // console.log('Combined Date Time String:', combinedDateTimeString);
    const date = new Date(combinedDateTimeString);
    // console.log(date); // Should not log "Invalid Date"
    
    if (isNaN(date.getTime())) {
      // console.error('Invalid Date constructed:', combinedDateTimeString);
      return "NaN";
    }
    
    const formattedTime = format(date, "hh:mm:ss a");
    
    return formattedTime;
  };

  // console.log("User Email: ", userEmail);
  // console.log("Friend Email: ", friendEmail);
  // console.log('Messages:', sortedMessages.map(m => ({ sender: m.sender, receiver: m.receiver })));
  // console.log("Times:", sortedMessages.map(m => m.time));



  return (
    <div className="message-container">
      <p className="subheading">message with</p>
      <p className="heading">{setSelectedFriend}</p>
      <div className="messages-list">
        {sortedMessages.map((messageObject, index) => (
          <div key={index}>
            {messageObject.sender === userEmail ? (
              <div className="sender-container">
                <span className="message-text">
                  {messageObject.message_content}
                </span>
                <span className="message-timestamp">
                  {formatTimestamp(messageObject.date, messageObject.time)}
                </span>
              </div>
            ) : (
              <div className="receiver-container">
                <span className="message-text">
                  {messageObject.message_content}
                </span>
                <span className="message-timestamp">
                  {formatTimestamp(messageObject.date, messageObject.time)}
                </span>
              </div>
            )}
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
