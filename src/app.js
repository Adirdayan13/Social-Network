import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import EditProfile from "./editprofile";
import Pictures from "./pictures";
import OtherProfile from "./otherprofile";
import { BrowserRouter, Route } from "react-router-dom";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        console.log("this.state from app: ", this.state);
    }
    componentDidMount() {
        console.log("this.state from app did mount: ", this.state);
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
    logout(e) {
        e.preventDefault();
        axios
            .post("/logout")
            .then(() => {
                location.replace("/");
            })
            .catch(err => {
                console.log("Error from post logout: ", err);
            });
    }
    render() {
        console.log("this.state from app render: ", this.state);
        if (!this.state.id) {
            return "Loading...";
        }
        return (
            <div className="app">
                <BrowserRouter>
                    <img
                        className="logo-img-after-login"
                        src="/pictures/logo.png"
                        alt="Logo"
                    />

                    <div className="edit-profile">
                        <p
                            onClick={() =>
                                this.setState({
                                    editProfile: true,
                                    done: false,
                                    uploaderIsVisible: false,
                                    picturesVisible: false
                                })
                            }
                        >
                            Edit Profile
                        </p>
                        <p
                            onClick={() =>
                                this.setState({
                                    picturesVisible: true,
                                    uploaderIsVisible: false,
                                    done: false,
                                    editProfile: false
                                })
                            }
                        >
                            Albums
                        </p>
                        <p onClick={e => this.logout(e)}>Log out</p>
                    </div>
                    <div className="logout"></div>
                    {this.state.editProfile && (
                        <EditProfile
                            setUpdate={(email, first, last) =>
                                this.setState({ email, first, last })
                            }
                            error={() => this.setState({ error: true })}
                            noError={() => this.setState({ error: false })}
                            editHandler={() =>
                                this.setState({ editProfile: true })
                            }
                            closeEdit={() =>
                                this.setState({ editProfile: false })
                            }
                            first={this.state.first}
                            last={this.state.last}
                            email={this.state.email}
                            id={this.state.id}
                        />
                    )}

                    <ProfilePic
                        clickHandler={() =>
                            this.setState({
                                uploaderIsVisible: true,
                                editProfile: false,
                                picturesVisible: false
                            })
                        }
                        picture_url={this.state.picture_url}
                        first={this.state.first}
                        last={this.state.last}
                    />

                    {this.state.uploaderIsVisible && (
                        <Uploader
                            picture_url={this.state.picture_url}
                            setImageUrl={picture_url =>
                                this.setState({ picture_url })
                            }
                            uploaderInvisible={() =>
                                this.setState({ uploaderIsVisible: false })
                            }
                            waitShow={() => this.setState({ wait: true })}
                            waitHide={() => this.setState({ wait: false })}
                            error={() => this.setState({ error: true })}
                            noError={() => this.setState({ error: false })}
                        />
                    )}

                    {this.state.picturesVisible && (
                        <Pictures
                            visible={() =>
                                this.setState({ picturesVisible: true })
                            }
                        />
                    )}

                    {this.state.error && (
                        <p className="error-upload">somehing went wrong</p>
                    )}
                    {this.state.wait && (
                        <img
                            className="loading-gif"
                            src="/pictures/loading.gif"
                        />
                    )}

                    <Route path="/user/:id" component={OtherProfile} />
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                picture_url={this.state.picture_url}
                                first={this.state.first}
                                last={this.state.last}
                                bio={this.state.bio}
                                editBio={bio => this.setState({ bio: bio })}
                                addBio={() =>
                                    this.setState({
                                        profileInvisible: true
                                    })
                                }
                                clickHandler={() =>
                                    this.setState({
                                        uploaderIsVisible: true
                                    })
                                }
                            />
                        )}
                    />
                </BrowserRouter>
            </div>
        );
    }
}
