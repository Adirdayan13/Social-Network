// import axios from "./axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStatus, acceptFriend, unfriend } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();

    const acceptedFriends = useSelector(
        state =>
            state.friendsWannabes &&
            state.friendsWannabes.filter(friend => friend.accepted)
    );

    const friendsWannabes = useSelector(
        state =>
            state.friendsWannabes &&
            state.friendsWannabes.filter(friend => !friend.accepted)
    );

    const showProfile = userId => {
        location.replace("user/" + userId);
    };

    useEffect(() => {
        dispatch(getStatus());
    }, []);

    return (
        <div className="friends-main">
            <h1 style={{ margin: "10px", textDecoration: "underline" }}>
                Your friends
            </h1>
            <div className="accepted-friends">
                {acceptedFriends &&
                    acceptedFriends.map(friend => (
                        <div className="friends-approved" key={friend.id}>
                            <p>
                                {friend.first} {friend.last}
                            </p>
                            <img
                                style={{ cursor: "pointer" }}
                                onClick={() => showProfile(friend.id)}
                                className="friends-pic"
                                src={friend.picture_url}
                            />
                            <br />
                            <button
                                className="unfriend-btn"
                                onClick={() => dispatch(unfriend(friend.id))}
                            >
                                Unfriend
                            </button>
                        </div>
                    ))}
            </div>
            <br />
            <h1 style={{ margin: "10px", textDecoration: "underline" }}>
                Want to be your friends:
            </h1>
            <div className="friendsWannabes">
                {friendsWannabes &&
                    friendsWannabes.map(friend => (
                        <div className="wannabe-friend" key={friend.id}>
                            <p>
                                {friend.first} {friend.last}
                            </p>
                            <img
                                style={{ cursor: "pointer" }}
                                onClick={() => showProfile(friend.id)}
                                className="friends-pic"
                                src={friend.picture_url}
                            />
                            <br />
                            <button
                                onClick={() =>
                                    dispatch(acceptFriend(friend.id))
                                }
                            >
                                Accept
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
