import React from "react";
// import Bioeditor from "./bioeditor";
// import axios from "./axios";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        console.log("this.props from Profile : ", this.props);
    }
    addBio(e) {
        e.preventDefault();
    }
    render() {
        return (
            <div className="profile">
                <h1>Profile</h1>
                <img
                    className="profile-pic-big"
                    src={this.props.picture_url}
                    onClick={this.props.clickHandler}
                />
                <div>
                    <h3>
                        {!this.props.bio && (
                            <div onClick={e => this.props.addBio(e)}>
                                Add bio:
                            </div>
                        )}
                        {this.props.bio && (
                            <div onClick={e => this.props.addBio(e)}>
                                Edit bio: {this.props.bio}
                            </div>
                        )}
                    </h3>
                </div>
            </div>
        );
    }
}
