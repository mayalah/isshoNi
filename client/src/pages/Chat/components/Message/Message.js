import "./Message.css";
//import sendArrow from "../assets/sendArrow.svg";

function Message({ setSelectedFriend }) {
  return (
    <div className="message-container">
        <p className="message-friend">{setSelectedFriend}</p> {/* Use selectedFriend directly */}
        <div className="place-holder">
            {/* Placeholder for future content */}
            {/* <div className="send-bar"> 
            </div> */}
        </div>
    </div> 
  );
}

export default Message;

