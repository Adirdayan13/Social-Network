import React from "react";
import { Link } from "react-router-dom";

export default function ProfilePic(props) {
    console.log("props from profilePic: ", props);
    const clickHandler = props.clickHandler;
    const first = props.first;
    const last = props.last;
    const picture_url = props.picture_url;

    return (
        <>
            <>
                <h1 className="welcome">
                    Welcome {first} {last}
                </h1>
            </>
            <div className="profile-pic-div">
                <Link to="/upload">
                    <img className="profile-pic" src={picture_url} />
                </Link>
            </div>
        </>
    );
}
