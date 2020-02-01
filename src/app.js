import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios
            .get("/user")
            .then(({ data }) => {
                console.log("data from app : ", data);
                if (data.picture_url == null) {
                    data.picture_url = "/pictures/default.png";
                    this.setState(data);
                } else {
                    this.setState(data);
                }
            })
            .catch(err => {
                console.log("error from GET user: ", err);
            });
    }
    render() {
        console.log("this.state from app render: ", this.state);
        if (!this.state.id) {
            return "Loading...";
        }
        return (
            <div className="app">
                <img
                    className="logo-img-after-login"
                    src="/pictures/logo.png"
                    alt="Logo"
                />
                <div className="ProfilePic">
                    <ProfilePic
                        clickHandler={() =>
                            this.setState({ uploaderIsVisible: true })
                        }
                        picture_url={this.state.picture_url}
                        first={this.state.first}
                        last={this.state.last}
                    />
                </div>
                {this.state.uploaderIsVisible && (
                    <div className="uploader">
                        <Uploader
                            picture_url={this.state.picture_url}
                            setImageUrl={picture_url =>
                                this.setState({ picture_url })
                            }
                            uploaderInvisible={() =>
                                this.setState({ uploaderIsVisible: false })
                            }
                        />
                    </div>
                )}

                <div className="profile">
                    <Profile
                        picture_url={this.state.picture_url}
                        first={this.state.first}
                        last={this.state.last}
                        bio={this.state.bio}
                        editBio={bio => this.setState({ bio: bio })}
                        addBio={() => this.setState({ profileInvisible: true })}
                        clickHandler={() =>
                            this.setState({ uploaderIsVisible: true })
                        }
                    />
                </div>
            </div>
        );
    }
}
