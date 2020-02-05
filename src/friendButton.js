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

    const sendRequest = function() {
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
    };

    return (
        <>
            <button onClick={sendRequest}>{friendOrNot.btnText}</button>
        </>
    );
}
