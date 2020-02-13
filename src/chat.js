import React, { useEffect, useRef } from "react";
import { socket } from "./socket.js";
import { useSelector } from "react-redux";
// import axios from "./axios";

export const Chat = ({ myId }) => {
    const chatMessages = useSelector(state => state && state.chatMessages);
    const onlineUsers = useSelector(state => state && state.onlineUsers);
    console.log("onlineUsers : ", onlineUsers);

    const elemRef = useRef();

    useEffect(() => {
        console.log("myId: ", myId);
        let { clientHeight, scrollHeight } = elemRef.current;
        elemRef.current.scrollTop = scrollHeight - clientHeight;
    }, [chatMessages]);

    const keyCheck = e => {
        if (e.key == "Enter") {
            e.preventDefault();
            socket.emit("Add message", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div className="chat">
            <h1>Chat Room! </h1>
            <div className="chat-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages
                        .slice(0)
                        .reverse()
                        .map(msg => {
                            return (
                                <div className="chat-msgs" key={msg.id}>
                                    {msg.user_id === myId && (
                                        <div className="me-chat">
                                            <img
                                                className="chat-pic"
                                                src={
                                                    msg.picture_url
                                                        ? msg.picture_url
                                                        : "/pictures/default.png"
                                                }
                                            />
                                            <span className="first-last-chat">
                                                {msg.first} {msg.last}
                                            </span>{" "}
                                            <span>
                                                {new Date(
                                                    msg.created_at
                                                ).toLocaleDateString("en-US", {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                                <br />
                                            </span>
                                            <p>{msg.message}</p>
                                        </div>
                                    )}
                                    {msg.user_id != myId && (
                                        <div className="otheruser-chat">
                                            <img
                                                className="chat-pic"
                                                src={
                                                    msg.picture_url
                                                        ? msg.picture_url
                                                        : "/pictures/default.png"
                                                }
                                            />
                                            <span className="first-last-chat">
                                                {msg.first} {msg.last}
                                            </span>{" "}
                                            <span>
                                                {new Date(
                                                    msg.created_at
                                                ).toLocaleDateString("en-US", {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                                <br />
                                            </span>
                                            <p>{msg.message}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
            </div>
            <div className="connected-users">
                <h3 style={{ margin: 0 }}>Online users:</h3>
                {onlineUsers &&
                    onlineUsers.map(user => (
                        <img
                            key={user.id}
                            className="chat-pic"
                            src={user.picture_url}
                        />
                    ))}
            </div>
            <textarea
                className="textarea-chat"
                placeholder="Add your message here"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
};
