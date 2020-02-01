import React from "react";

export default function ProfilePic(props) {
    console.log("props from profilePic: ", props);
    const clickHandler = props.clickHandler;
    const first = props.first;
    const last = props.last;
    const picture_url = props.picture_url;

    return (
        <div className="profile-pic-div-main">
            <div className="greets">
                <h1 className="welcome">
                    Welcome {first} {last}
                </h1>
            </div>
            <div className="profile-pic-div">
                <img
                    className="profile-pic"
                    onClick={clickHandler}
                    src={picture_url}
                />
            </div>
        </div>
    );
}
