import React from "react";
import axios from "./axios";

export async function getStatus() {
    //axios request to server
    //all action creaters will return object that have a type property

    const { data } = await axios.get("/friends-requests");
    console.log("data from friends-request: ", data.rows);

    return {
        type: "RECEIVE_USERS",
        friendsWannabes: data.rows
    };
}

export async function acceptFriend(recipient_id) {
    const { data } = await axios.post(
        "/friends-status/accept/" + recipient_id + ".json"
    );
    console.log("data from acceptFriend: ", data);
    return {
        type: "ACCEPT_FRIEND",
        acceptFriend: data.rows
    };
}

export async function declineFriend(recipient_id) {
    const { data } = await axios.post(
        "/friends-status/cancel/" + recipient_id + ".json"
    );
    console.log("data from declineFriend: ", data);
    return {
        type: "UNFRIEND",
        declineFriend: data.rows
    };
}
