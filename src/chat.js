import React, { useEffect, useRef } from "react";
import { socket } from "./socket.js";
import { useSelector } from "react-redux";
// import axios from "./axios";

export function Chat() {
    const chatMessages = useSelector(state => state && state.chatMessages);

    console.log("chatMessages: ", chatMessages);

    const elemRef = useRef();

    useEffect(() => {
        let { clientHeight, scrollTop, scrollHeight } = elemRef.current;
        console.log("scroll top", scrollTop);
        console.log("clien height", clientHeight);
        console.log("scroll height", scrollHeight);
        elemRef.current.scrollTop = scrollHeight - clientHeight;
    }, []);

    const keyCheck = e => {
        console.log("which key is preseed", e.key);
        if (e.key == "Enter") {
            e.preventDefault();
            console.log("what the user is typing", e.target.value);
            socket.emit("Chat message", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div className="chat">
            <h1>Chat Room! </h1>
            <div className="chat-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map((msg, index) => {
                        console.log("msg from loop: ", msg);
                        return (
                            <>
                                <p key={index}>
                                    {msg.first}: {msg.message}
                                </p>
                            </>
                        );
                    })}
            </div>
            <textarea
                style={{ width: "300px", height: "150px" }}
                placeholder="Add your message here"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
}
