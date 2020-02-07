import React from "react";
import axios from "./axios";

export async function getStatus() {
    //axios request to server
    //all action creaters will return object that have a type property
    //
    const { data } = await axios.get("/friends-requests");
    console.log("data from friends-request: ", data.rows);

    return {
        type: "RECEIVE_USERS",
        friendsWannabes: data.rows
    };
}

// export function acceptFriend() {
//     //axios request to server
//     //all action creaters will return object that have a type property
//     const acceptFriend = () => {};
// }

// export function declineFriend() {
//     //axios request to server
//     //all action creaters will return object that have a type property
//     // const declineFriend = () => {
//     //     axios
//     //         .post("/friends-status/cancel/" + props.recipient_id + ".json")
//     //         .then(results => {
//     //             console.log("results from cancel: ", results);
//     //             setFriendOrNot(results.data);
//     //         })
//     //         .catch(err => {
//     //             console.log("error from cancel: ", err);
//     //         });
// }
// }
