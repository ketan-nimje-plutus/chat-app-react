import ChatInput from "./ChatInput";
import { postdata, getdata, postimage } from "../Utils/http.class";
import { useEffect, useRef, useState } from "react";
import "../assets/CSS/chatcontainer.css";
import { socket } from "../socket";
import "react-toastify/dist/ReactToastify.css";
import noDP from "../../public/noDP.jpg";
import moment from "moment";
import { errorToast } from "../Components/Toast";
import Loader from "../Components/Loader";
import ImageModel from "../Components/ImageModel";
import video from "../../public/video.jpg";
import pdf from "../../public/pdf.png";
import ppt from "../../public/ppt.png";
import zip from "../../public/zip.png";
import doc from "../../public/doc.png";
import xls from "../../public/xls.png";

function ChatContainer({ currentChat, currentUser }) {
  const [message, setMessage] = useState([]);
  const [getMsg, setGetMsg] = useState();
  const [data, setData] = useState(5);
  const [loadding, setLoadding] = useState(true);
  const [showImg, setShowImg] = useState(false);
  const [Img, setImg] = useState(null);
  const scroll = useRef(null);
  const [chatGptImg, setChatGptImg] = useState(false);

  const msgBox = document.getElementById("scrollTop");

  console.log("socket.connected", socket.connected);
  console.log("message", message);

  //handle msg(database,socket,and frontend)
  const handleSendChat = async (msg, type) => {
    console.log("send chat called", type);
    const data = {
      from: currentUser.id,
      to: currentChat._id,
      message: msg,
      msg_type: type,
    };
    // console.log("data", data);
    const response = await postdata("message/sendMessage", data);
    const res = await response.json();

    socket.emit("send-msg", {
      from: currentUser?.id,
      to: currentChat?._id,
      socketid: currentChat?.socketid,
      message: msg,
      msg_type: type,
    });
    const info = [...message];
    info.push({ fromSelf: true, message: msg, msg_type: type });
    setMessage(info);
  };
  //handle ImagehandleSendImage
  const handleSendImage = async (file, type) => {
    console.log("send image called", type);

    const data = new FormData();
    data.append("image", file);
    data.append("from", currentUser.id);
    data.append("to", currentChat._id);
    data.append("msg_type", type);
    const response = await postimage("message/sendImage", data);
    const res = await response.json();
    console.log("resssssss", res.data);
    if (res.status == 400) {
      errorToast(res.error);
    }

    const info = [...message];
    info.push({ fromSelf: true, attechment: res.data, msg_type: type });
    setMessage(info);

    socket.emit("send-msg", {
      from: currentUser.id,
      to: currentChat._id,
      attechment: res.data,
      msg_type: type,
    });
  };
  //get message from the database
  const getmessage = async () => {
    const data = {
      from: currentUser.id,
      to: currentChat._id,
    };
    const response = await postdata("message/getAllMessage", data);
    const res = await response.json();
    console.log("res res", res);
    setMessage(res.message);
    setLoadding(false);
  };

  //change message status seen or unseen
  const changeStatus = async () => {
    const data = {
      to: currentUser?.id,
      from: currentChat?._id,
    };
    const res = await postdata("message/changeStatus", data);
  };

  const viewMore = async () => {
    setData(data + 5);
  };
  const handleScroll = () => {
    const scrolldown = msgBox.scrollHeight - msgBox.scrollTop;
    if (scrolldown >= msgBox.scrollHeight) {
      viewMore();
    }
  };

  useEffect(() => {
    msgBox?.addEventListener("scroll", handleScroll);
    return () => {
      msgBox?.removeEventListener("scroll", handleScroll);
    };
  });

  useEffect(() => {
    if (socket) {
      socket.on("msg-recieve", (data) => {
        if (data.to === currentChat._id) {
          if (data.message) {
            setGetMsg({
              fromSelf: false,
              message: data.message,
              msg_type: data.msg_type,
            });
          } else {
            setGetMsg({
              fromSelf: false,
              attechment: data.attechment,
              msg_type: data.msg_type,
            });
          }
        } else {
          setGetMsg();
        }
      });
    }
  });
  useEffect(() => {
    {
      getMsg && setMessage([...message, getMsg]);
    }
  }, [getMsg]);
  useEffect(() => {
    changeStatus();
  }, [message]);
  useEffect(() => {
    setData(10);
    getmessage();
  }, [currentChat]);
  useEffect(() => {
    const div = scroll.current;
    if (div) {
      div.scroll({ top: div.scrollHeight, left: 0, behavior: "smooth" });
    }
  }, [message]);

  console.log("...", showImg);
  console.log("data", data);
  const handleDownload = (Img) => {
    let URL;
    if (chatGptImg) {
      URL = Img;
      saveAs(URL, "image.png");
    } else {
      URL = `https://chat-app-backend-2qte.onrender.com/public/${Img}`;
      saveAs(URL, Img);
    }
  };
  return (
    <>
      {/* <ToastContainer /> */}
      <div className="chat-container">
        <div className="user-container">
          <img className="profile-img" src={noDP} alt=" "></img>
          {currentChat?.name}
        </div>
        <div id="scrollTop" className="messages-container" ref={scroll}>
          {/* {message.length > 10 && (
            <button className="view-more-button" onClick={() => viewMore()}>
              View more
            </button>
          )} */}
          {loadding ? (
            <div className="loader-container">
              <Loader />
            </div>
          ) : (
            message &&
            message.slice(-data).map((data, index) => {
              const ext = data.attechment?.split(".").pop();
              return (
                <div
                  key={index}
                  className={
                    data.fromSelf ? "messages-send" : "messages-rececive"
                  }
                >
                  {data.message && (
                    <p
                      className={data.fromSelf ? "sender-msg" : "receiver-msg"}
                    >
                      {data.message}
                      <br></br>
                    </p>
                  )}
                  {data.attechment &&
                    (data.attechment &&
                    (ext == "png" || ext == "jpeg" || ext == "jpg") ? (
                      <img
                        src={`https://chat-app-backend-2qte.onrender.com/public/${data.attechment}`}
                        style={{
                          height: "200px",
                          width: "200px",
                          border: "2px solid #d9d9d9",
                        }}
                        onClick={() => {
                          handleDownload(data.attechment);
                        }}
                      />
                    ) : data.attechment && ext == "mp4" ? (
                      <img
                        src={video}
                        style={{
                          height: "120px",
                          width: "200px",
                          border: "2px solid #d9d9d9",
                        }}
                        onClick={() => {
                          handleDownload(data.attechment);
                        }}
                      />
                    ) : data.attechment && ext == "ppt" ? (
                      <img
                        src={ppt}
                        style={{
                          height: "120px",
                          width: "200px",
                          border: "2px solid #d9d9d9",
                        }}
                        onClick={() => {
                          handleDownload(data.attechment);
                        }}
                      />
                    ) : data.attechment && ext == "zip" ? (
                      <img
                        src={zip}
                        style={{
                          height: "120px",
                          width: "200px",
                          border: "2px solid #d9d9d9",
                        }}
                        onClick={() => {
                          handleDownload(data.attechment);
                        }}
                      />
                    ) : data.attechment && (ext == "xls" || ext == "xlsx") ? (
                      <img
                        src={xls}
                        style={{
                          height: "120px",
                          width: "200px",
                          border: "2px solid #d9d9d9",
                        }}
                        onClick={() => {
                          handleDownload(data.attechment);
                        }}
                      />
                    ) : data.attechment && (ext == "docx" || ext == "doc") ? (
                      <img
                        src={doc}
                        style={{
                          height: "120px",
                          width: "200px",
                          border: "2px solid #d9d9d9",
                        }}
                        onClick={() => {
                          handleDownload(data.attechment);
                        }}
                      />
                    ) : (
                      <img
                        src={pdf}
                        style={{
                          height: "120px",
                          width: "200px",
                          border: "2px solid #d9d9d9",
                        }}
                        onClick={() => {
                          handleDownload(data.attechment);
                        }}
                      />
                    ))}

                  <span className="time">
                    {moment(
                      data.createdAt ? data.createdAt : new Date()
                    ).format("h:mm: a")}
                  </span>
                </div>
              );
            })
          )}

          {showImg ? (
            <ImageModel
              Img={Img}
              setShowImg={setShowImg}
              chatGptImg={chatGptImg}
            />
          ) : null}
          <div ref={scroll}></div>
        </div>

        <div className="type"></div>
        <div className="chat-input">
          <ChatInput
            handleSendChat={handleSendChat}
            handleSendImage={handleSendImage}
          />
        </div>
      </div>
    </>
  );
}

export default ChatContainer;
