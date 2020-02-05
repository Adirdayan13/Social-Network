import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton(props) {
    const [friendOrNot, setfriendOrNot] = useState([]);
    console.log("props: ", props);

    useEffect(() => {
        (async () => {
            try {
                console.log("try !");
                // const { data } = await axios.get("/users/" + user + ".json");
            } catch (e) {
                console.log(e);
            }
        })();
    }, [friendOrNot]);

    return (
        <>
            <button>Friend Button </button>
        </>
    );
}
