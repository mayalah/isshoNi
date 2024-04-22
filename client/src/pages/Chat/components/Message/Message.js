import "./Message.css";
import { useState, useEffect, useRef } from "react";
import * as APIRoutes from "../../../../utils/APIRoutes";
import sendArrow from "../../../../assets/sendArrow.svg";
import { format } from "date-fns";
import axios from "axios";
import io from "socket.io-client";

function Message({ setSelectedFriend, userEmail, friendEmail }) {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sortedMessages, setSortedMessages] = useState([]);
  const socketRef = useRef(null);

  // Initialize the socket connection
  useEffect(() => {
    socketRef.current = io("http://localhost:3000");
    socketRef.current.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    // Clean up the socket connection when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Fetch messages from the server
  useEffect(() => {
    axios
      .post(APIRoutes.getMessages, {
        userEmail: userEmail,
        friendEmail: friendEmail,
        message_id: "",
      })
      .then((response) => {
        setMessages(response.data);
        const sorted = response.data.sort((a, b) => {
          return new Date(a.time) - new Date(b.time);
        });
        setSortedMessages(sorted);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }, [userEmail, friendEmail, sortedMessages]);

  // Sort messages by date and time when the messages state changes
  useEffect(() => {
    const sortMessages = messages.sort(
      (a, b) =>
        new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
    );
    setSortedMessages(sortMessages);
  }, [messages]);

  // Send a message to the server from UI
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const currentDate = new Date();
      const dateStr = currentDate.toISOString().split("T")[0]; // FORMAT: YYYY-MM-DD
      const timeStr = currentDate.toLocaleTimeString("en-US"); // FORMAT: h:mm:ss A

      const newMessage = {
        sender: userEmail,
        receiver: friendEmail,
        message: messageInput,
        date: dateStr,
        time: timeStr,
      };

      // Emit the message event to the server
      if (socketRef.current) {
        socketRef.current.emit("sendMessage", newMessage);
      }

      // UI update
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Clears message input after sending
      setMessageInput("");

      // Send message to server
      axios
        .post(APIRoutes.addMessage, newMessage)
        .then((response) => {
          console.log("Message sent successfully", response.data);
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    }
  };

  function reformatDateString(input) {
    // the given input format is YYYY-DD-MM -> convert it to YYYY-MM-DD
    const parts = input.split('-'); 
    if (parts.length === 3) {
      const year = parts[0];
      const day = parts[1].padStart(2, '0'); // Ensures day is 2 digits
      const month = parts[2].padStart(2, '0'); // Ensures month is 2 digits
  
      // month and day needs to be valid
      if (parseInt(month) > 0 && parseInt(month) <= 12 && parseInt(day) > 0 && parseInt(day) <= 31) {
        return `${year}-${month}-${day}`; // correct value for formatTimeStamp
      } 
    } else {
      console.error('ReformatDateString: Invalid input format: ', input);
      return null; 
    }
  }
  

  const formatTimestamp = (dateString, timeString) => {
    // Extract the hours, minutes, and seconds from the time string
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes, seconds] = time.split(":");

    // Convert 12-hour time to 24-hour time
    hours = parseInt(hours, 10);
    hours = modifier === "PM" && hours !== 12 ? hours + 12 : hours;
    hours = modifier === "AM" && hours === 12 ? 0 : hours;

    const combinedDateTimeString = `${dateString} ${hours}:${minutes}:${seconds}`;
    const date = new Date(combinedDateTimeString);

    if (isNaN(date.getTime())) {
      return "NaN";
    }

    const formattedTime = format(date, "hh:mm:ss a");

    return formattedTime;
  };

  return (
    <div
      className="message-container"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
      }}
    >
      <p className="subheading">message with</p>
      <p className="heading">{setSelectedFriend}</p>
      <div className="messages-list">
        {sortedMessages.map((messageObject, index) => (
          <div key={index}>
            {messageObject.sender === userEmail ? (
              <div>
              <div className="flex flex-col justify-end w-full">
                <div className="sender-container">
                  <p className="message-text">
                    {messageObject.message_content}
                  </p>
                </div>
                <p className="message-timestamp-sender">
                    {formatTimestamp(reformatDateString(messageObject.date), messageObject.time)}
                  </p>
              </div>
              </div>
            ) : (
              <div>
              <div className="flex flex-col justify-start w-full ">
                <div className="receiver-container ">
                  <p className="message-text ">
                    {messageObject.message_content}
                  </p>
                </div>
                <p className="message-timestamp-receiver">
                    {formatTimestamp(reformatDateString(messageObject.date), messageObject.time)}
                  </p>
              </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="send-bar">
        <input
          type="text"
          className="message-input"
          placeholder="type a message..."
          value={messageInput}
          onChange={(e) => {
            setMessageInput(e.target.value);
          }}
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
