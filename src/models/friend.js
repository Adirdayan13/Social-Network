import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStatus, acceptFriend, unfriend } from "../actions";
// const dispatch = useDispatch();

export const Friend = ({ id, firstName, lastName, imageUrl, isFriend }) => (
    <>
        <div className={isFriend ? "friends-approved" : "wannabe-friend"}>
            <p>
                {firstName} {lastName}
            </p>
            <img className="friends-pic" src={imageUrl} />
            <br />
            <button
                className="unfriend-btn"
                onClick={() =>
                    isFriend
                        ? useDispatch(unfriend(id))
                        : useDispatch(acceptFriend(id))
                }
            >
                {isFriend ? "Unfriend" : "Accept friend"}
            </button>
        </div>
    </>
);
