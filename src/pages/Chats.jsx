import Contact from "./Contact";
import "../assets/CSS/chat.css";
import { useState } from "react";
import { getdata } from "../Utils/http.class";
import { useEffect } from "react";
import Welcome from "./Welcome";
import ChatContainer from "./ChatContainer";
import { useSelector } from "react-redux";
import { socket } from "../socket";
import { Navigate } from "react-router-dom";
import AiChatContainer from "./AiChatContainer";
import AiImageContainer from "./AiImageContainer";
import ClientChatConatainer from "./ClientChatConatainer";

function Chats() {
  const [currentChat, setCurrentChat] = useState(undefined);
  const [onlineUser, setOnlineUser] = useState([]);
  const [contact, setContact] = useState();
  const [onlineIs, setonlineIsUser] = useState(false);

  console.log(currentChat, 'currentChatcurrentChat')
  const { isLoggin, user } = useSelector((state) => state.auth);
  const UserData = JSON.parse(localStorage.getItem('userdata'));
  console.log(UserData, '1111')
  console.log("user11", user);
  console.log("onlineIsonlineIs", onlineIs);

  if (!isLoggin) {
    console.log("not login");
    return <Navigate to="/form" />;
  }

  console.log("current chat", currentChat);
  console.log("current contact", contact);
  const getUsers = async () => {
    const res = await getdata("user/getUser");
    const response = await res.json();
    setContact(response.users);
  };

  console.log(contact, 'contactcontactcontact')

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
  console.log(user, 'user111111')

  //handle current user
  const handleCurrentChat = (chat) => {
    console.log(chat, 'chatsetCurrentChat')
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
          setonlineIsUser={setonlineIsUser}
        />
      </div>
      <div className="chat">
        {currentChat === undefined ? (
          <Welcome />
        )
          : currentChat == "AI" ? (
            // <AiChatContainer currentUser={user} />
            // ) : currentChat == "AI_Image" ? (

            <AiImageContainer currentUser={user} />
          )
            : (

              user.contactNumber !== null ?
                <ChatContainer currentChat={currentChat} currentUser={user} />
                :
                // onlineIs == true ?
                <ClientChatConatainer currentChat={currentChat} currentUser={user} onlineIs={onlineIs} />
              // : "Hello"

            )}
      </div>

    </div>
  );
}

export default Chats;
