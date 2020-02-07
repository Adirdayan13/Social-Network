import React, { useEffect } from "react";
import axios from "./axios";
import { useDispatch, useSelector } from "react-redux";
import { getStatus, acceptFriend, declineFriend } from "./actions";

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
    console.log("acceptedFriends: ", acceptedFriends);
    console.log("friendsWannabes: ", friendsWannabes);

    useEffect(() => {
        dispatch(getStatus());
    }, []);

    return (
        <div className="friends-main">
            <h1>Your friends</h1>
            {acceptedFriends &&
                acceptedFriends.map(friend => (
                    <div className="friends-approved" key={friend.id}>
                        <img className="friends-pic" src={friend.picture_url} />
                        <br />
                        <p>
                            {friend.first} {friend.last}
                        </p>
                    </div>
                ))}
            <br />
            <h1>Want to be your friends:</h1>
            <>
                {friendsWannabes &&
                    friendsWannabes.map(friend => (
                        <div key={friend.id}>
                            <img
                                className="friends-pic"
                                src={friend.picture_url}
                            />
                            <br />
                            <p>
                                {friend.first} {friend.last}
                            </p>
                        </div>
                    ))}
            </>
        </div>
    );
}
// {
//     friendsWannabes.map(friend => <div>{friend}</div>);
// }

// acceptedFriends.map((friend, index) => <div>{friend}</div>);
