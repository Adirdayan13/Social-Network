import * as io from "socket.io-client";
import { getMessages, chatMessage } from "./actions";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        // socket.on("chatMessages", msgs => store.dispatch(chatMessages(msgs)));
        //
        // socket.on("chatMessage", msg => store.dispatch(chatMessage(msg)));

        socket.on("muffin", msg => {
            console.log("can everyone see this ? ", msg);
        });
        socket.on("getMessages", msg => {
            console.log("msg: ", msg);
            store.dispatch(getMessages(msg));
        });
    }
};
