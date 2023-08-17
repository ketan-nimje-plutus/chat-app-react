import Contact from "./Contact";
import "../assets/CSS/chat.css";
import { useState } from "react";
import { getdata, postdata } from "../Utils/http.class";
import { useEffect } from "react";
import Welcome from "./Welcome";
import ChatContainer from "./ChatContainer";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { socket } from "../socket";
import { Navigate } from "react-router-dom";
import AiChatContainer from "./AiChatContainer";
import AiImageContainer from "./AiImageContainer";
// import { Container, Row, Col } from "react-bootstrap";

function Chats() {
  const navigate = useNavigate();
  const [currentChat, setCurrentChat] = useState(undefined);

  const [contact, setContact] = useState();

  const { isLoggin, user } = useSelector((state) => state.auth);

  if (!isLoggin) {
    console.log("not login");
    // navigate("/login");
    return <Navigate to="/login" />;
  }

  console.log("current chat", currentChat);
  const getUsers = async () => {
    const res = await getdata("user/getUser");
    const response = await res.json();
    setContact(response.users);
  };

  //get all users from backend
  useEffect(() => {
    getUsers();
  }, []);

  //add  user in socket
  useEffect(() => {
    if (user) {
      socket.emit("add-user", user.id);
    }
  }, [user]);

  //handle current user
  const handleCurrentChat = (chat) => {
    setCurrentChat(chat);
    // console.log("current chat",chat)
  };

  return (
    <div className="main-container">
      <div className="contact">
        <Contact
          handleCurrentChat={handleCurrentChat}
          contact={contact}
          currentUser={user}
        />
      </div>
      <div className="chat">
        {currentChat === undefined ? (
          <Welcome />
        ) : currentChat == "AI" ? (
          <AiChatContainer currentUser={user} />
        ) : currentChat == "AI_Image" ? (
          <AiImageContainer currentUser={user} />
        ) : (
          <ChatContainer currentChat={currentChat} currentUser={user} />
        )}
      </div>
    </div>
  );
}

export default Chats;
