import axios from "./axios";

export async function getStatus() {
    const { data } = await axios.get("/friends-requests");
    return {
        type: "RECEIVE_USERS",
        friendsWannabes: data.rows
    };
}

export async function acceptFriend(recipient_id) {
    await axios.post("/friends-status/accept/" + recipient_id + ".json");
    return {
        type: "ACCEPT_FRIEND",
        recipient_id
    };
}

export async function unfriend(recipient_id) {
    await axios.post("/friends-status/cancel/" + recipient_id + ".json");
    return {
        type: "UNFRIEND",
        recipient_id
    };
}

export async function getMessages(msg) {
    return {
        type: "GET_MESSAGES",
        msg
    };
}

export async function addMessage(msg) {
    return {
        type: "ADD_MESSAGE",
        msg
    };
}

export function onlineUsers(results) {
    return {
        type: "SHOW_ONLINE_USERS",
        results
    };
}
