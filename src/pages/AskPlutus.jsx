import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import "../assets/CSS/chatcontainer.css";

function AskPlutus({ currentUser }) {
    const [message, setMessage] = useState([]);
    const [typing, setTyping] = useState(false);
    const [demo, setDemo] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const questions = [
        {
            question: "What is your name?",
            validation: (value) => value.trim() !== ""
        },
        {
            question: "What is your email?",
            validation: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        },
        {
            question: "What is your phone number?",
            validation: (value) => /^\d{10}$/.test(value)
        }
    ];
    const scroll = useRef(null);

    useEffect(() => {
        askQuestion(0);
    }, []);

    const askQuestion = (index) => {
        if (index < questions.length) {
            setTyping(true);
            setTimeout(() => {
                setMessage((prevMessage) => [
                    ...prevMessage,
                    {
                        fromSelf: false,
                        message: questions[index].question
                    }
                ]);
                setCurrentQuestionIndex(index);
                setTyping(false);
            }, 1000);
        } else {
            // If all questions are answered, display a button
            setMessage((prevMessage) => [
                ...prevMessage,
                {
                    fromSelf: false,
                    message: (
                        <button onClick={handleButtonClick}>Click Here</button>
                    )
                }
            ]);
        }
    };

    const handleSendChat = async (msg) => {
        if (msg) {
            setDemo(true);
            setTyping(true);
        }

        const infoo = [...message];
        infoo.push({ fromSelf: true, message: msg });
        setMessage([...infoo]);

        // Validate the user's response
        const isValid = questions[currentQuestionIndex].validation(msg);

        // Simulate a delay before moving to the next question or button
        setTimeout(() => {
            setTyping(false);
            if (isValid) {
                askQuestion(currentQuestionIndex + 1);
            } else {
                askQuestion(currentQuestionIndex); // Ask the same question again
            }
        }, 1000);
    };

    //   const handleButtonClick = () => {
    //     // Handle the button click here
    //     // You can perform any action you want when the button is clicked
    //     // For example, display a thank you message.
    //     setMessage((prevMessage) => [
    //       ...prevMessage,
    //       {
    //         fromSelf: false,
    //         message: <a target="_blank" href="https://chat-bot-pooja.netlify.app/"></a>
    //       }
    //     ]);
    //   };
    const handleButtonClick = () => {
        // Handle the button click here
        // Open the link without adding a message
        window.open("https://chat-bot-pooja.netlify.app/", "_blank");
    };

    useEffect(() => {
        const div = scroll.current;
        if (div) {
            div.scroll({ top: div.scrollHeight, left: 0, behavior: "smooth" });
        }
    }, [message]);

    return (
        <>
            <div className="chat-container">
                <div className="user-container">
                    {/* Display AI or user info here */}
                </div>
                <div id="scrollTop" className="messages-container" ref={scroll}>
                    {message?.map((data, index) => {
                        return (
                            <div
                                key={index}
                                className={
                                    data.fromSelf ? "messages-send" : "messages-rececive"
                                }
                            >
                                <pre className={data.fromSelf ? "sender-msg" : "receiver-msg"}>
                                    {data.message}
                                    <br></br>
                                </pre>
                            </div>
                        );
                    })}
                </div>
                <div className="type">
                    {typing && demo ? <p>Typing...</p> : null}
                </div>
                <div className="chat-input">
                    {currentQuestionIndex < questions.length ? (
                        <ChatInput
                            handleSendChat={handleSendChat}
                            placeholder={questions[currentQuestionIndex].question}
                        />
                    ) : null}
                </div>
            </div>
        </>
    );
}

export default AskPlutus;
