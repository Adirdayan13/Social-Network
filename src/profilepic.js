import React from "react";

export default function ProfilePic(props) {
    console.log("props: ", props);
    const clickHandler = props.clickHandler;
    const first = props.first;
    const last = props.last;
    const picture_url = props.picture_url;
    return (
        <div>
            <h1>Welcome</h1>
            <h2>
                {first} {last}
            </h2>
            <img
                className="profile-pic"
                onClick={clickHandler}
                src={picture_url}
            />
        </div>
    );
}
