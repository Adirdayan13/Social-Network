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
    }, [acceptFriend, friendsWannabes]);

    return (
        <div className="friends-main">
            <h1>Your friends</h1>
            {acceptedFriends &&
                acceptedFriends.map(friend => (
                    <div className="friends-approved" key={friend.id}>
                        <p>
                            {friend.first} {friend.last}
                        </p>
                        <img className="friends-pic" src={friend.picture_url} />
                        <br />
                        <button
                            onClick={e => dispatch(declineFriend(friend.id))}
                        >
                            Unfriend
                        </button>
                        <br />
                    </div>
                ))}
            <br />
            <div className="friendsWannabes">
                <h1>Want to be your friends:</h1>
                {friendsWannabes &&
                    friendsWannabes.map(friend => (
                        <div className="wannabe-friend" key={friend.id}>
                            <p>
                                {friend.first} {friend.last}
                            </p>
                            <img
                                className="friends-pic"
                                src={friend.picture_url}
                            />
                            <br />
                            <button
                                onClick={e => dispatch(acceptFriend(friend.id))}
                            >
                                Accept
                            </button>
                            <br />
                        </div>
                    ))}
            </div>
        </div>
    );
}
// {
//     friendsWannabes.map(friend => <div>{friend}</div>);
// }

// acceptedFriends.map((friend, index) => <div>{friend}</div>);
