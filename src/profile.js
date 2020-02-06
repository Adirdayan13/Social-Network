import React from "react";
import BioEditor from "./bioeditor";
import { BrowserRouter, Route } from "react-router-dom";
import SmallPictures from "./smallpics";
import { Link } from "react-router-dom";
// import axios from "./axios";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        console.log("this.props from Profile : ", this.props);
    }
    render() {
        return (
            <div className="main-profile" style={{ display: "flex" }}>
                <div className="profile">
                    <p className="fullname-profile">
                        {this.props.first} {this.props.last}
                    </p>
                    <Link to="/upload">
                        <img
                            className="profile-pic-big"
                            src={this.props.picture_url}
                        />
                    </Link>

                    <div className="BioEditor-from-profile">
                        <BioEditor
                            picture_url={this.props.picture_url}
                            first={this.props.first}
                            last={this.props.last}
                            bio={this.props.bio}
                            editBio={this.props.editBio}
                            clickHandler={() =>
                                this.setState({
                                    uploaderIsVisible: true
                                })
                            }
                        />
                    </div>
                </div>
                <div className="smallpics">
                    <SmallPictures />
                </div>
            </div>
        );
    }
}
