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

let userList = [];

function ClientChatConatainer() {

    const [message, setMessage] = useState([]);
    const [BD, setBD] = useState([]);
    const [getMsg, setGetMsg] = useState();
    const [data, setData] = useState(5);
    const [loadding, setLoadding] = useState(true);
    const [showImg, setShowImg] = useState(false);
    const [Img, setImg] = useState(null);
    const scroll = useRef(null);
    const [chatGptImg, setChatGptImg] = useState(false);
    const storedDataString = localStorage.getItem('client')
    const parsedData = JSON.parse(storedDataString);
    const msgBox = document.getElementById("scrollTop");
    const [onlineUser, setOnlineUser] = useState([]);
    const [oUser, setOUser] = useState([]);
    const [chatUser, setChatUser] = useState([])
    const [contact, setContact] = useState();
    let currentUser = parsedData?._id
    const DataGet = localStorage.getItem('currentChat')
    const currentChat = JSON.parse(DataGet);

    const getUsers = async () => {
        const res = await getdata("user/getUser");
        const response = await res.json();
        setContact(response.users);
    };
    useEffect(() => {
        getUsers();
    }, []);


    const getUsersID = async () => {
        const data = {
            "id": currentChat?.userID
        }
        const res = await postdata("user/getbyid", data);
        const response = await res.json();
        setChatUser(response.users)
    };
    useEffect(() => {
        getUsersID();
    }, []);

    userList = contact?.map((data) => data);
    useEffect(() => {
        if (socket) {
            socket.on("online-user", (data) => {
                setOUser(data)
                data.forEach((element) => {
                    let index = userList?.findIndex((item) => item?._id == element?.userID);
                    if (index >= 0) {
                        userList[index].socketid = data.socketId;
                    }
                });
                setOnlineUser(data);
            });
        }
    }, [socket, userList]);


    //handle msg(database,socket,and frontend)
    const handleSendChat = async (msg, type) => {
        const data = {
            from: currentUser,
            to: currentChat?.userID,
            message: msg,
            msg_type: type,
        };

        const response = await postdata("message/sendMessage", data);
        const res = await response.json();
        socket.emit("send-msg", {
            from: currentUser,
            to: currentChat.userID,
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
        const data = new FormData();
        data.append("image", file);
        data.append("from", currentUser);
        data.append("to", currentChat.userID);
        data.append("msg_type", type);
        const response = await postimage("message/sendImage", data);
        const res = await response.json();
        if (res.status == 400) {
            errorToast(res.error);
        }

        const info = [...message];
        info.push({ fromSelf: true, attechment: res.data, msg_type: type });
        setMessage(info);

        socket.emit("send-msg", {
            from: currentUser,
            to: currentChat.userID,
            attechment: res?.data,
            msg_type: type,
        });
    };
    //get message from the database
    const getmessage = async () => {
        const data = {
            id: currentUser,
            //   to: currentChat,
        };
        const response = await postdata("message/userMessage", data);
        const res = await response.json();
        setBD(res)
        setMessage(res.message);
        setLoadding(false);
    };

    //change message status seen or unseen
    const changeStatus = async () => {
        const data = {
            to: currentUser,
            from: currentChat.userID,
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
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on("msg-recieve", (data) => {
                if (data.to === currentChat) {
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
    }, []);
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
    }, []);
    useEffect(() => {
        const div = scroll.current;
        if (div) {
            div.scroll({ top: div.scrollHeight, left: 0, behavior: "smooth" });
        }
    }, [message]);

    const handleDownload = (Img) => {
        let URL;
        if (chatGptImg) {
            URL = Img;
            saveAs(URL, "image.png");
        } else {
            URL = `http://localhost:9090/public/${Img}`;
            saveAs(URL, Img);
        }
    };
    return (
        <>
            <div className="chat-container">
                <div className="client-container">
                    <img className="profile-img" src={noDP} alt=" " style={{ width: "70px", height: "70px" }}></img>
                    <p className="Client-Name">{"Plutustec"}</p>
                </div>
                <div id="scrollTop" className="messages-container" ref={scroll}>
                    {message.length > 10 && (
                        <button className="view-more-button" onClick={() => viewMore()}>
                            View more
                        </button>
                    )}
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
                                    {/* {data.message && (
                                        <>
                                            <p className={data.fromSelf ? "sender-msg" : "receiver-msg"}>
                                                {data.message}
                                            </p>

                                        </>
                                    )} */}
                                    {data.message && (
                                        <>
                                            <div className={data.fromSelf ? "your-message" : "chat-msg-data"}>
                                                <div> <img className="profile-img" src={noDP} alt=" " style={{ width: "70px", height: "70px" }}></img></div>
                                                <div>
                                                    <div className="time-user-chat">
                                                        <div>{data?.fromSelf ? <span className="you-text ml-2">you</span> : <div className="you-text"> {'Plutustec'}</div>}</div>
                                                        <span className="time">
                                                            {moment(
                                                                data.createdAt ? data.createdAt : new Date()
                                                            ).format("h:mm: a")}
                                                        </span>
                                                    </div>
                                                    <p
                                                        className={data.fromSelf ? "sender-msg" : "receiver-msg"}
                                                    >
                                                        {data.message}
                                                        <br></br>
                                                    </p>
                                                </div>
                                            </div>

                                        </>
                                    )}
                                    {data.attechment &&
                                        (data.attechment &&
                                            (ext == "png" || ext == "jpeg" || ext == "jpg") ? (
                                            <img
                                                src={`http://localhost:9090/public/${data.attechment}`}
                                                style={{
                                                    height: "190px",
                                                    width: "213px",
                                                    border: "2px solid #d9d9d9",
                                                }}
                                                onClick={() => {
                                                    handleDownload(data.attechment);
                                                }}
                                            />
                                        ) : data.attechment && ext == "mp4" ? (
                                            <video
                                                src={`http://localhost:9090/public/${data.attechment}`}
                                                autoPlay
                                                style={{
                                                    height: "105px",
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
                                                    width: "120px",
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
                                                    width: "120px",
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
                                                    width: "120px",
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
                                                    width: "120px",
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
                                                    width: "120px",
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
                <div className="chat-send-msg-input">
                <div className="type"></div>
                <div className="chat-input">
                    <ChatInput
                        handleSendChat={handleSendChat}
                        handleSendImage={handleSendImage}
                    />
                </div>
            </div>
            </div>
        </>
    );
}

export default ClientChatConatainer;
