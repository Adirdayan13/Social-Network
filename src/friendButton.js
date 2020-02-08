import React, { useState, useEffect } from "react";
import axios from "./axios";
// import { Link } from "react-router-dom";

export default function FriendButton(props) {
    const [friendOrNot, setFriendOrNot] = useState([]);
    const [picture, setPicture] = useState([]);
    const [albumExist, setAlbumExist] = useState([]);
    console.log("props: ", props);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(
                    "/friends-status/" + props.recipient_id + ".json"
                );
                console.log("data from GET friendButton: ", data);
                setFriendOrNot(data);
            } catch (e) {
                console.log(e);
            }
            try {
                axios
                    .get("/pictures/" + props.recipient_id + ".json")
                    .then(results => {
                        console.log(
                            "results from pictures/recipient_id: ",
                            results.data
                        );
                        setAlbumExist(results.data);
                        console.log("albumExist: ", albumExist);
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
        console.log("data from const sendRequest: ", friendOrNot);
        if (friendOrNot.btnText == "Cancel friend request") {
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
            const { data } = axios
                .post("/friends-status/" + props.recipient_id + ".json")
                .then(results => {
                    console.log("results from POST /friends-status: ", results);
                    setFriendOrNot(results.data);
                })
                .catch(err => {
                    console.log("error from POST /friends-status: ", err);
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
            console.log("data from accept friend request: ", data);
        }
        if (friendOrNot.btnText == "Unfriend") {
            axios
                .post("/friends-status/cancel/" + props.recipient_id + ".json")
                .then(results => {
                    console.log("results from cancel: ", results);
                    setFriendOrNot(results.data);
                    setPicture([]);
                })
                .catch(err => {
                    console.log("error from cancel: ", err);
                });
        }
    };

    const showAlbum = function() {
        console.log("friends or not: ", friendOrNot);
        console.log("albumExist: ", albumExist);
        console.log("picture: ", picture);
        /// make axios to get pictures before !!

        axios
            .get("/friend-album/" + props.recipient_id + ".json")
            .then(results => {
                setPicture(results.data.pictures);
                console.log("results from get friend pictures: ", results);
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
