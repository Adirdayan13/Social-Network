import * as io from "socket.io-client";
import { getMessages, addMessage, onlineUsers } from "./actions";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("addMessage", msg => {
            store.dispatch(addMessage(msg));
        });
        socket.on("getMessages", msg => {
            store.dispatch(getMessages(msg));
        });
        socket.on("onlineUsers", results => {
            console.log("online Users are from socket : ", results);
            store.dispatch(onlineUsers(results));
        });
    }
};
