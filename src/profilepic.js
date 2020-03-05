import React from "react";
import { Link } from "react-router-dom";

export default function ProfilePic(props) {
    // console.log("props from profilePic: ", props);
    const clickHandler = props.clickHandler;
    const first = props.first;
    const last = props.last;
    const picture_url = props.picture_url;
    const animataionFalse = props.animataionFalse;

    return (
        <>
            <div className="profile-pic-div">
                <p style={{ marginRight: "10px" }}>
                    {first} {last}
                </p>
                <Link to="/upload">
                    <img
                        className="profile-pic"
                        src={picture_url}
                        onClick={animataionFalse}
                    />
                </Link>
            </div>
        </>
    );
}
