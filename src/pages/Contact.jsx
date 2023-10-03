// import { useEffect } from "react";
// import noDP from "../../public/User-image.png";
// import "../assets/CSS/contact.css";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { socket } from "../socket";
// import { postdata } from "../Utils/http.class";
// import { errorToast } from "../Components/Toast";
// import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import ShowClientinChat from "./ShowClientinChat";
// let userList = [];

// function Contact({
//   handleCurrentChat,
//   contact,
//   currentUser,
//   setOnlineUser,
//   onlineUser,
//   message,
// }) {
// // function Contact({ handleCurrentChat, contact, currentUser , setonlineIsUser}) {
//   const [search, setSearch] = useState("");
//   const [searchData, setSearchData] = useState([]);
//   const { user } = useSelector((state) => state.auth);
//   const [currentChat, setCurrentChat] = useState();
//   const [messages, setMessages] = useState([]);
//   const [notification, setNotification] = useState([]);
//   userList = contact?.filter((data) => data._id !== currentUser.id);
//   const UserData = JSON.parse(localStorage.getItem("userdata"));
//   const [searchLoader, setSearchLoader] = useState(false);

//   //online user
//   useEffect(() => {
//     if (socket) {
//       socket.on("online-user", (data) => {
//         data.forEach((element) => {
//           let index = userList?.findIndex((item) => item._id == element.userID);
//           if (index >= 0) {
//             userList[index].socketid = data.socketId;
//           }
//         });
//         setOnlineUser(data);
//       });
//     }
//   }, [socket, userList]);

//   //fileter message notification
//   const userNotification = (user) => {
//     let filterData;
//     if (notification) {
//       filterData =
//         notification &&
//         notification?.filter((note) => {
//           return note?.from === user?._id;
//         });
//     } else {
//       filterData = null;
//     }
//     return filterData;
//   };

//   //get unseen message
//   const viewMessage = async () => {
//     const data = {
//       to: currentUser.id,
//     };
//     const res = await postdata("message/isViewMessage", data);
//     const response = await res.json();
//     if (response.message == "You are Not verifed") {
//       errorToast(response.message);
//     }
//     setNotification(response.message);
//   };

//   const getmessage = async (fromUser, toUser) => {
//     const data = {
//       from: fromUser._id,
//       to: toUser._id,
//     };
//     const response = await postdata("message/getAllMessage", data);
//     const res = await response.json();
//     console.log(
//       "Messages between",
//       fromUser.fullName,
//       "and",
//       toUser.fullName,
//       ":",
//       res.message
//     );

//     setMessages(res.message);
//     setLoadding(false);
//   };

//   useEffect(() => {
//     if (currentChat && currentChat.role === "BD") {
//       getmessage(currentUser, currentChat);
//     }
//   }, [currentChat]);

//   //change status of message seen or unseen
//   const changeStatus = async () => {
//     const data = {
//       to: currentUser.id,
//       from: currentChat?._id,
//     };

//     const res = await postdata("message/changeStatus", data);
//     const response = await res.json();
//     if (response.message == "You are Not verifed") {
//       errorToast(response.message);
//     }
//   };

//   //search user
//   const searchUser = async () => {
//     const data = {
//       search: search,
//     };
//     const res = await postdata("user/searchUser", data);
//     const response = await res.json();
//     if (response) {
//       setSearchData(response.user);
//       setSearchLoader(false);
//     }
//   };
//   useEffect(() => {
//     viewMessage();
//     changeStatus();
//   }, [currentChat]);

//   useEffect(() => {
//     viewMessage();
//   }, []);

//   useEffect(() => {
//     searchUser();
//   }, [search]);

//   useEffect(() => {
//     socket.on("msg-notification", () => {
//       viewMessage();
//     });
//   }, []);

//   return (
//     <>
//       <div className="contact-conainer">
//         <div className="searchContainer">
//           <FontAwesomeIcon className="icon-search" icon={faMagnifyingGlass} />
//           <input
//             className="search-input"
//             placeholder="search here.."
//             type="text"
//             onChange={(e) => {
//               setSearchLoader(true);
//               setSearch(e.target.value);
//             }}
//           />
//           {searchLoader ? (
//             <div className="loader-line"></div>
//           ) : (
//             <div style={{ height: "4px" }}></div>
//           )}
//         </div>
//         <div className="favourite-container">
//           <div className="favourite">Favourite</div>
//           <div
//             className={
//               currentChat === "AI"
//                 ? "wrapper selected-contact-name "
//                 : "wrapper"
//             }
//             onClick={() => {
//               handleCurrentChat("AI");
//               setCurrentChat("AI");
//             }}
//           >
//             <div className="contact-img">
//               <img className="img" src={noDP} alt=" " />
//               {/* {isOnline ? <div className="online"></div> : null} */}
//             </div>
//             <div className="contact-name">AI</div>
//           </div>
//           <div
//             className={
//               currentChat === "AI_Image"
//                 ? "wrapper selected-contact-name "
//                 : "wrapper"
//             }
//             onClick={() => {
//               handleCurrentChat("AI_Image");
//               setCurrentChat("AI_Image");
//             }}
//           >
//             <div className="contact-img">
//               <img className="img" src={noDP} alt=" " />
//               {/* {isOnline ? <div className="online"></div> : null} */}
//             </div>
//             <div className="contact-name">AI Image</div>
//           </div>
//         </div>
//         <div className="favourite">Chats</div>

//         {search === ""
//           ? userList?.map((data, index) => {
//               const isOnline = onlineUser?.some(
//                 (user) => user?.userID === data?._id
//               );
//               setonlineIsUser( isOnline)
//               const userNote = userNotification(data);

//               if (UserData?.role === "BD") {
//                 return (
//                   <div
//                     key={index}
//                     className={
//                       currentChat?.name === data.name
//                         ? "wrapper selected-contact-name "
//                         : "wrapper"
//                     }
//                     onClick={() => {
//                       handleCurrentChat(data);
//                       setCurrentChat(data);
//                     }}
//                   >
//                     <div className="contact-img">
//                       <img className="img" src={noDP} alt=" " />
//                       {isOnline ? <div className="online"></div> : null}
//                     </div>
//                     <div className="contact-name">{data?.name}</div>
//                     {currentChat?._id === data?._id ? " " : userNote.length > 0 && (
//                       <div className="notification">{userNote.length}</div>
//                     )}
//                   </div>
//                 );
//               } else if (UserData?.role !== "BD" && data?.role === "BD") {
//                 return (
//                   <div
//                     key={index}
//                     className={
//                       currentChat?.name === data.name
//                         ? "wrapper selected-contact-name "
//                         : "wrapper"
//                     }
//                     onClick={() => {
//                       handleCurrentChat(data);
//                       setCurrentChat(data);
//                     }}
//                   >
//                     <div className="contact-img">
//                       <img className="img" src={noDP} alt=" " />
//                       {isOnline ? <div className="online"></div> : null}
//                     </div>
//                     <div className="contact-name">{data?.name}</div>
//                     {currentChat?._id === data?._id ? " " : userNote.length > 0 && (
//                       <div className="notification">{userNote.length}</div>
//                     )}
//                   </div>
//                 );
//               } else {
//                 return null;
//               }
//             })
//           : searchData?.map((data, index) => {
//               const isOnline = onlineUser?.some(
//                 (user) => user?.userID === data?._id
//               );
//               setonlineIsUser( isOnline)
//               const userNote = userNotification(data);

//               if (currentUser?.role === "BD" || data?.role === "BD") {
//                 return (
//                   <div
//                     key={index}
//                     className={
//                       currentChat?.fullName === data.fullName
//                         ? "wrapper selected-contact-name "
//                         : "wrapper"
//                     }
//                     onClick={() => {
//                       handleCurrentChat(data);
//                       setCurrentChat(data);
//                     }}
//                   >
//                     <div className="contact-img">
//                       <img className="img" src={noDP} alt=" " />
//                       {isOnline ? <div className="online"></div> : null}
//                     </div>
//                     <div className="contact-name">
//                       <p style={{ color: "black" }}>{data?.fullName}</p>
//                     </div>
//                     {currentChat?._id === data?._id ? " " : userNote.length > 0 && (
//                       <div className="notification">{userNote.length}</div>
//                     )}
//                   </div>
//                 );
//               } else {
//                 return null;
//               }
//             })}
//       </div>
//     </>
//   );
// }

// export default Contact;


import { useEffect } from "react";
import noDP from "../../public/noDP.jpg";
import "../assets/CSS/contact.css";
import { useState } from "react";
import { useSelector } from "react-redux";
import { socket } from "../socket";
import { postdata } from "../Utils/http.class";
import { errorToast } from "../Components/Toast";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
let userList = [];
function Contact({ handleCurrentChat, contact, currentUser }) {
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [onlineUser, setOnlineUser] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [currentChat, setCurrentChat] = useState();
  const [notification, setNotification] = useState([]);
  userList = contact?.filter((data) => data._id !== currentUser.id);
  const [searchLoader, setSearchLoader] = useState(false);

  //online user

  useEffect(() => {
    if (socket) {
      socket.on("online-user", (data) => {
        console.log("online-user", data);
        data.forEach((element) => {
          let index = userList?.findIndex((item) => item._id == element.userID);
          if (index >= 0) {
            userList[index].socketid = data.socketId;
          }
        });
        setOnlineUser(data);
      });
    }
    console.log("socket");
  }, [socket, userList]);

  //fileter message notification
  const userNotification = (user) => {
    let filterData;
    if (notification) {
      filterData =
        notification &&
        notification?.filter((note) => {
          return note?.from === user?._id;
        });
    } else {
      filterData = null;
    }
    return filterData;
  };

  //get unseen message
  const viewMessage = async () => {
    const data = {
      to: currentUser.id,
    };
    const res = await postdata("message/isViewMessage", data);
    const response = await res.json();
    if (response.message == "You are Not verifed") {
      errorToast(response.message);
    }
    setNotification(response.message);
  };

  //change status of message seen or unseen
  const changeStatus = async () => {
    const data = {
      to: currentUser.id,
      from: currentChat?._id,
    };

    const res = await postdata("message/changeStatus", data);
    const response = await res.json();
    if (response.message == "You are Not verifed") {
      errorToast(response.message);
    }
  };

  //search user
  const searchUser = async () => {
    const data = {
      search: search,
    };
    const res = await postdata("user/searchUser", data);
    const response = await res.json();
    if (response) {
      setSearchData(response.user);
      setSearchLoader(false);
    }
  };

  useEffect(() => {
    viewMessage();
    changeStatus();
  }, [currentChat]);

  useEffect(() => {
    viewMessage();
  }, []);

  useEffect(() => {
    searchUser();
  }, [search]);

  useEffect(() => {
    socket.on("msg-notification", () => {
      viewMessage();
    });
  }, []);

  return (
    <>
      <div className="contact-conainer">
        <div className="searchContainer">
          <FontAwesomeIcon className="icon-search" icon={faMagnifyingGlass} />
          <input
            className="search-input"
            placeholder="search here.."
            type="text"
            onChange={(e) => {
              setSearchLoader(true);
              setSearch(e.target.value);
            }}
          />
          {searchLoader ? (
            <div className="loader-line"></div>
          ) : (
            <div style={{ height: "4px" }}></div>
          )}
        </div>
        <div className="favourite">Chats</div>
        {search == ""
          ? userList?.map((data, index) => {
              const isOnline = onlineUser?.some(
                (user) => user?.userID === data?._id
              );
              const userNote = userNotification(data);
              return (
                <div
                  key={index}
                  className={
                    currentChat?.name === data.name
                      ? "wrapper selected-contact-name "
                      : "wrapper"
                  }
                  onClick={() => {
                    handleCurrentChat(data);
                    setCurrentChat(data);
                  }}
                >
                  <div className="contact-img">
                    <img className="img" src={noDP} alt=" " />
                    {isOnline ? <div className="online"></div> : null}
                  </div>
                  <div className="contact-name">{data?.name}</div>
                  {currentChat?._id === data?._id
                    ? " "
                    : userNote.length > 0 && (
                        <div className="notification">{userNote.length}</div>
                      )}
                </div>
              );
            })
          : searchData?.map((data, index) => {
              const isOnline = onlineUser?.some(
                (user) => user?.userID === data?._id
              );
              const userNote = userNotification(data);
              return (
                <div
                  key={index}
                  className="wrapper"
                  onClick={() => {
                    handleCurrentChat(data);
                    setCurrentChat(data);
                  }}
                >
                  <div className="contact-img">
                    <img className="img" src={noDP} alt=" " />

                    {isOnline ? <div className="online"></div> : null}
                  </div>
                  <div className="contact-name">
                    <p style={{ color: "black" }}>{data?.name}</p>
                  </div>

                  {currentChat?._id === data?._id
                    ? " "
                    : userNote.length > 0 && (
                        <div className="notification">{userNote.length}</div>
                      )}
                </div>
              );
            })}
      </div>
    </>
  );
}

export default Contact;
