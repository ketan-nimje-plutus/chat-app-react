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
function Contact({ handleCurrentChat, contact, currentUser }) {
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [onlineUser, setOnlineUser] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [currentChat, setCurrentChat] = useState();
  const [notification, setNotification] = useState([]);
  const userList = contact?.filter((data) => data._id !== user.id);
  const [searchLoader, setSearchLoader] = useState(false);
  //online user
  useEffect(() => {
    if (socket) {
      socket.on("online-user", (data) => {
        setOnlineUser(data);
      });
    }
  }, [socket]);

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
      to: user.id,
    };
    const res = await postdata("message/isViewMessage", data);
    const response = await res.json();
    if (response.message == "You are Not verifed") {
      errorToast(response.message);
    }
    setNotification(response.message);
  };

  //change status of message seen or unseen
  const changeStatus = async (contact) => {
    const data = {
      to: user.id,
      from: currentChat._id,
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
  });

  useEffect(() => {
    searchUser();
  }, [search]);

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

        <div className="favourite-container">
          <div className="favourite">Favourite</div>
          <div
            className={
              currentChat === "AI"
                ? "wrapper selected-contact-name "
                : "wrapper"
            }
            onClick={() => {
              handleCurrentChat("AI");
              setCurrentChat("AI");
            }}
          >
            <div className="contact-img">
              <img className="img" src={noDP} alt=" " />
              {/* {isOnline ? <div className="online"></div> : null} */}
            </div>
            <div className="contact-name">AI</div>
          </div>

          <div
            className={
              currentChat === "AI_Image"
                ? "wrapper selected-contact-name "
                : "wrapper"
            }
            onClick={() => {
              handleCurrentChat("AI_Image");
              setCurrentChat("AI_Image");
            }}
          >
            <div className="contact-img">
              <img className="img" src={noDP} alt=" " />
              {/* {isOnline ? <div className="online"></div> : null} */}
            </div>
            <div className="contact-name">AI Image</div>
          </div>
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
