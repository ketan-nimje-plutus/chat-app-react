import Picker from "emoji-picker-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import "../assets/CSS/chat-input.css";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { errorToast } from "../Components/Toast";

function ChatInput({ handleSendChat, handleSendImage }) {
  const [showEmoji, setShowEmoji] = useState(false);
  const [msg, setMsg] = useState("");
  const [attechment, setAttechment] = useState(null);
  const [selected, setSelected] = useState(false);
  const [type, setType] = useState("");

  const { getInputProps, getRootProps, fileRejections } = useDropzone({
    onDrop: (acceptFile) => {
      console.log("acceptFile", acceptFile[0]);
      validation(acceptFile[0]);
      setAttechment(
        Object.assign(acceptFile, {
          preview: URL.createObjectURL(acceptFile[0]),
        })
      );
      setTimeout(() => {
        sendChat();
      }, 200);
    },
  });
  const validation = (file) => {
    console.log("fileeeee type...", file.type);
    if (file.size > 5 * 1024 * 1024) {
      errorToast("invalid size lenth");
      setAttechment(null);
      setSelected(false);
      return;
    }
    if (
      file.type != "image/jpeg" &&
      file.type != "image/png" &&
      file.type != "image/jpeg" &&
      file.type != "application/pdf" &&
      file.type != "text/html" &&
      file.type != "text/plain" &&
      file.type !=
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      file.type != "video/mp4"
    ) {
      errorToast("invalid type !!!");
      setAttechment(null);
      setSelected(false);

      return;
    }
    setSelected(true);
    setType(file.type);
  };
  console.log("typeeeeeee", type);

  const setEmoji = (emoji, event) => {
    let message = msg;
    message = msg + emoji.emoji;
    setMsg(message);
  };

  const sendChat = () => {
    if (attechment) {
      handleSendImage(attechment[0], type && type);
      setAttechment(null);
    } else if (msg) {
      handleSendChat(msg, "message");
    }
    setMsg("");
    setSelected(false);
    setShowEmoji(false);
  };

  return (
    <>
      <div className="input-container">
        <form
          className="send-box"
          onSubmit={(e) => {
            e.preventDefault();
            sendChat();
          }}
        >
          <div className="btn-send">
            <div className="emoji">
              <FontAwesomeIcon
                className="icons"
                icon={faFaceSmile}
                onClick={() => setShowEmoji(!showEmoji)}
              />
              <div className="emoji-picker">
                {showEmoji && <Picker onEmojiClick={setEmoji} />}
              </div>
            </div>
            <div className="attechment" {...getRootProps()}>
              <input {...getInputProps()} />
              <FontAwesomeIcon icon={faPaperclip} className="icons" />
            </div>
            <input
              className="input"
              type="text"
              value={msg}
              placeholder="Send a message"
              onChange={(e) => {
                setMsg(e.target.value);
              }}
            />
            {(msg !== "" || selected) && (
              <button id="sub" className="send-button" type="submit">
                {" "}
                ➤
              </button>
            )}
          </div>
        </form>
        <div></div>
      </div>
    </>
  );
}

export default ChatInput;
