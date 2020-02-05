import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton(props) {
    const [friendOrNot, setFriendOrNot] = useState([]);
    console.log("props: ", props);

    useEffect(() => {
        (async () => {
            try {
                console.log("try !");
                const { data } = await axios.get(
                    "/friends-status/" + props.recipient_id + ".json"
                );
                console.log("data from GET friendButton: ", data);
                setFriendOrNot(data);
            } catch (e) {
                console.log(e);
            }
        })();
    }, []);

    const handleClick = function() {
        console.log("data from const sendRequest: ", friendOrNot);
        if (friendOrNot.btnText == "Cancel friend request") {
            console.log("I am in cancel friend request");
            axios
                .post("/friends-status/cancel/" + props.recipient_id + ".json")
                .then(results => {
                    console.log("results from cancel: ", results);
                    setFriendOrNot(results.data);
                })
                .catch(err => {
                    console.log("error from cancel: ", err);
                });
        }

        if (friendOrNot.btnText == "Send friend request") {
            console.log("I am in Send friend request");
            const { data } = axios
                .post("/friends-status/" + props.recipient_id + ".json")
                .then(results => {
                    console.log("results from POST /friends-status: ", results);
                    setFriendOrNot(results.data);
                })
                .catch(err => {
                    console.log("error from POST /friends-status");
                });
            console.log("data from POST friendButton: ", data);
        }

        if (friendOrNot.btnText == "Accept friend request") {
            const { data } = axios
                .post("/friends-status/accept/" + props.recipient_id + ".json")
                .then(results => {
                    console.log(
                        "results from POST friends-status/accept: ",
                        results
                    );
                    setFriendOrNot(results.data);
                })
                .catch(err => {
                    console.log("error from POST friends-status/accept: ", err);
                });
        }
        if (friendOrNot.btnText == "Unfriend") {
            axios
                .post("/friends-status/cancel/" + props.recipient_id + ".json")
                .then(results => {
                    console.log("results from cancel: ", results);
                    setFriendOrNot(results.data);
                })
                .catch(err => {
                    console.log("error from cancel: ", err);
                });
        }
    };

    return (
        <>
            <button onClick={handleClick}>{friendOrNot.btnText}</button>
        </>
    );
}
