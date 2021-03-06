import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import EditProfile from "./editprofile";
import Pictures from "./pictures";
import OtherProfile from "./otherprofile";
import FindPeople from "./FindPeople";
import Friends from "./friends";
import News from "./news";
import { Chat } from "./chat";

import { Link } from "react-router-dom";
import { BrowserRouter, Route } from "react-router-dom";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // console.log("this.state from app: ", this.state);
    }
    componentDidMount() {
        axios
            .get("/user")
            .then(({ data }) => {
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
    changeText(e) {
        console.log("e:", e);
    }
    redirect() {
        location.replace("/");
    }
    animataionFalse() {
        this.setState({
            waitPictures: false,
            errorPictures: false,
            wait: false,
            error: false
        });
    }

    render() {
        // console.log("this.state from app render: ", this.state);
        if (!this.state.id) {
            return "Loading...";
        }
        return (
            <div className="app">
                <BrowserRouter>
                    <div className="header">
                        <div className="l-header">
                            <Link to="/">
                                <img
                                    className="logo-img-after-login"
                                    src="/pictures/logo.png"
                                    alt="Logo"
                                    onClick={() => this.animataionFalse()}
                                />
                            </Link>
                        </div>

                        <div className="r-header">
                            <Link className="news-link" to="/newscomp">
                                <i className="far fa-newspaper"></i>
                                <p>News</p>
                            </Link>
                            <Link className="friend-link" to="/friends">
                                <i className="fas fa-users"></i>
                                <p> Friends</p>
                            </Link>
                            <Link className="users-link" to="/users">
                                <i className="fas fa-search"></i>
                                <p>Search</p>
                            </Link>
                            <Link className="mypictures-link" to="/mypictures">
                                <i className="far fa-images"></i>
                                <p>Album</p>
                            </Link>
                            <Link className="chat-link" to="/chat">
                                <i className="far fa-comments"></i>
                                <p>Chat</p>
                            </Link>
                            <Link className="edit-link" to="/edit">
                                <i className="fas fa-user-edit"></i>
                                <p>Edit</p>
                            </Link>
                            <Link className="logout-link" to="/">
                                <i className="fas fa-sign-out-alt"></i>
                                <p onClick={e => this.logout(e)}>Log out</p>
                            </Link>
                            <div className="text-header">
                                <ProfilePic
                                    picture_url={this.state.picture_url}
                                    first={this.state.first}
                                    last={this.state.last}
                                    animataionFalse={() =>
                                        this.animataionFalse()
                                    }
                                />
                            </div>
                        </div>

                        {this.state.error && (
                            <p className="error-upload">somehing went wrong</p>
                        )}
                        {this.state.wait && (
                            <img
                                className="loading-gif-uploader"
                                src="/pictures/loading.gif"
                            />
                        )}

                        <Route
                            path="/upload"
                            component={() => (
                                <Uploader
                                    picture_url={this.state.picture_url}
                                    setImageUrl={picture_url =>
                                        this.setState({ picture_url })
                                    }
                                    waitShow={() =>
                                        this.setState({ wait: true })
                                    }
                                    noError={() =>
                                        this.setState({ error: false })
                                    }
                                    error={() => this.setState({ error: true })}
                                    animataionFalse={() =>
                                        this.animataionFalse()
                                    }
                                />
                            )}
                        />
                    </div>

                    <div className="profile-main">
                        <Route path="/user/:id" component={OtherProfile} />
                        <Route
                            path="/edit"
                            component={() => (
                                <EditProfile
                                    setUpdate={(email, first, last) =>
                                        this.setState({ email, first, last })
                                    }
                                    error={() => this.setState({ error: true })}
                                    noError={() =>
                                        this.setState({ error: false })
                                    }
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
                        />
                        <Route path="/chat">
                            <Chat myId={this.state.id} />
                        </Route>
                        <Route exact path="/friends/" component={Friends} />
                        <Route
                            path="/mypictures"
                            render={() => (
                                <Pictures
                                    waitShow={() =>
                                        this.setState({ waitPictures: true })
                                    }
                                    error={() =>
                                        this.setState({ errorPictures: true })
                                    }
                                    waitHide={() =>
                                        this.setState({ waitPictures: false })
                                    }
                                    noError={() =>
                                        this.setState({ errorPictures: false })
                                    }
                                />
                            )}
                        />
                        {this.state.errorPictures && (
                            <p className="error-upload-pictures">
                                somehing went wrong
                            </p>
                        )}
                        {this.state.waitPictures && (
                            <img
                                className="loading-gif-pictures"
                                src="/pictures/loading.gif"
                            />
                        )}
                        <Route exact path="/users/" component={FindPeople} />
                        {!this.state.profileAndBio && (
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <Profile
                                        id={this.state.id}
                                        picture_url={this.state.picture_url}
                                        first={this.state.first}
                                        last={this.state.last}
                                        bio={this.state.bio}
                                        editBio={bio =>
                                            this.setState({ bio: bio })
                                        }
                                        addBio={() =>
                                            this.setState({
                                                profileInvisible: true
                                            })
                                        }
                                        clickHandler={() => (
                                            <Link to="/upload"></Link>
                                        )}
                                    />
                                )}
                            />
                        )}
                        <Route exact path="/newscomp/" component={News} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
