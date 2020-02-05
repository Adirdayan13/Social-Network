import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import EditProfile from "./editprofile";
import Pictures from "./pictures";
import OtherProfile from "./otherprofile";
import FindPeople from "./FindPeople";
import { Link } from "react-router-dom";
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
    changeText(e) {
        console.log("e:", e);
    }
    redirect() {
        location.replace("/");
    }
    render() {
        console.log("this.state from app render: ", this.state);
        if (!this.state.id) {
            return "Loading...";
        }
        return (
            <div className="app">
                <BrowserRouter>
                    <div className="header">
                        <Link to="/">
                            <img
                                className="logo-img-after-login"
                                src="/pictures/logo.png"
                                alt="Logo"
                            />
                        </Link>
                        <div className="text-header">
                            <ul>
                                <li>
                                    <Link to="/">Menu</Link>
                                    <ul>
                                        <li>
                                            <Link to="/users">Search</Link>
                                        </li>{" "}
                                        <li>
                                            <Link to="/edit">Edit profile</Link>
                                        </li>{" "}
                                        <li>
                                            <Link to="/mypictures">Album</Link>
                                        </li>{" "}
                                        <li onClick={e => this.logout(e)}>
                                            <a>Log out</a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <ProfilePic
                            picture_url={this.state.picture_url}
                            first={this.state.first}
                            last={this.state.last}
                        />

                        {this.state.error && (
                            <p className="error-upload">somehing went wrong</p>
                        )}
                        {this.state.wait && (
                            <img
                                className="loading-gif"
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
                                    waitHide={() =>
                                        this.setState({ wait: false })
                                    }
                                    error={() => this.setState({ error: true })}
                                    noError={() =>
                                        this.setState({ error: false })
                                    }
                                />
                            )}
                        />
                    </div>

                    <div className="profile-main">
                        <Route path="/user/:id" component={OtherProfile} />
                        <Route path="/edit" component={EditProfile} />
                        <Route path="/mypictures" component={Pictures} />
                        <Route exact path="/users/" component={FindPeople} />
                        {!this.state.profileAndBio && (
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <Profile
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
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
