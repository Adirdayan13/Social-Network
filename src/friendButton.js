import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton(props) {
    const [friendOrNot, setFriendOrNot] = useState([]);
    const [picture, setPicture] = useState([]);
    const [albumExist, setAlbumExist] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(
                    "/friends-status/" + props.recipient_id + ".json"
                );
                setFriendOrNot(data);
            } catch (e) {
                console.log(e);
            }
            try {
                axios
                    .get("/pictures/" + props.recipient_id + ".json")
                    .then(results => {
                        setAlbumExist(results.data);
                    })
                    .catch(err => {
                        console.log("Error from pictures/recipient_id: ", err);
                    });
            } catch (e) {
                console.log("e: ", e);
            }
        })();
    }, [picture]);

    const handleClick = function() {
        if (friendOrNot.btnText == "Cancel friend request") {
            axios
                .post("/friends-status/cancel/" + props.recipient_id + ".json")
                .then(results => {
                    setFriendOrNot(results.data);
                })
                .catch(err => {
                    console.log("error from cancel: ", err);
                });
        }

        if (friendOrNot.btnText == "Send friend request") {
            const { data } = axios
                .post("/friends-status/" + props.recipient_id + ".json")
                .then(results => {
                    setFriendOrNot(results.data);
                })
                .catch(err => {
                    console.log("error from POST /friends-status: ", err);
                });
        }

        if (friendOrNot.btnText == "Accept friend request") {
            const { data } = axios
                .post("/friends-status/accept/" + props.recipient_id + ".json")
                .then(results => {
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
                    setFriendOrNot(results.data);
                    setPicture([]);
                })
                .catch(err => {
                    console.log("error from cancel: ", err);
                });
        }
    };

    const showAlbum = function() {
        axios
            .get("/friend-album/" + props.recipient_id + ".json")
            .then(results => {
                setPicture(results.data.pictures);
            })
            .catch(err => {
                console.log("error from get friend pictures: ", err);
            });
    };

    return (
        <div className="album">
            {friendOrNot.btnText == "Unfriend" && !!albumExist.length && (
                <button onClick={showAlbum}>Show {props.first} album</button>
            )}
            <br />
            {friendOrNot.btnText != "Unfriend" && (
                <button onClick={handleClick}>{friendOrNot.btnText}</button>
            )}

            {friendOrNot.btnText == "Unfriend" && (
                <button className="unfriend-btn" onClick={handleClick}>
                    {friendOrNot.btnText}
                </button>
            )}

            <div className="album-sub-main-div">
                {picture.map((pic, index) => (
                    <img
                        key={index}
                        src={pic.picture}
                        className="pictures-album"
                    />
                ))}
            </div>
        </div>
    );
}
