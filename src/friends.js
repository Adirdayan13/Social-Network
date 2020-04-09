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
            {acceptedFriends && (
                <>
                    {acceptedFriends.length == 0 && (
                        <h2
                            style={{
                                margin: "10px",
                                textDecoration: "underline"
                            }}
                        >
                            You have no friends yet, go to search and find more
                            people to connect to.
                        </h2>
                    )}
                </>
            )}
            {acceptedFriends && (
                <>
                    {acceptedFriends.length > 0 && (
                        <h2
                            style={{
                                margin: "10px",
                                textDecoration: "underline"
                            }}
                        >
                            You have {acceptedFriends && acceptedFriends.length}{" "}
                            {acceptedFriends.length > 1 ? "friends" : "friend"}
                        </h2>
                    )}
                </>
            )}

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
                                src={
                                    friend.picture_url
                                        ? friend.picture_url
                                        : "/pictures/default.png"
                                }
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
            {friendsWannabes && (
                <>
                    {friendsWannabes.length == 0 && (
                        <h2
                            style={{
                                margin: "10px",
                                textDecoration: "underline"
                            }}
                        >
                            You have no friend requests.
                        </h2>
                    )}
                    {friendsWannabes.length > 0 && (
                        <h1
                            style={{
                                margin: "10px",
                                textDecoration: "underline"
                            }}
                        >
                            {friendsWannabes && friendsWannabes.length} people
                            want to be your friend:
                        </h1>
                    )}
                </>
            )}

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
                                src={
                                    friend.picture_url
                                        ? friend.picture_url
                                        : "/pictures/default.png"
                                }
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
