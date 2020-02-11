import * as io from "socket.io-client";
import { getMessages, addMessage } from "./actions";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        // socket.on("chatMessages", msgs => store.dispatch(chatMessages(msgs)));
        //
        // socket.on("chatMessage", msg => store.dispatch(chatMessage(msg)));

        socket.on("addMessage", msg => {
            store.dispatch(addMessage(msg));
            console.log("msg from addMessage: ", msg);
        });
        socket.on("getMessages", msg => {
            console.log("msg from getMessages: ", msg);
            store.dispatch(getMessages(msg));
        });
    }
};
