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
import { Chat } from "./chat";
import News from "./news";

import { Link } from "react-router-dom";
import { BrowserRouter, Route } from "react-router-dom";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // console.log("this.state from app: ", this.state);
    }
    componentDidMount() {
        // console.log("this.state from app did mount: ", this.state);
        axios
            .get("/user")
            .then(({ data }) => {
                // console.log("data from app : ", data);
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

        // axios
        //     .get("/news")
        //     .then(results => {
        //         // console.log("results from news: ", results.data.articles);
        //         this.setState({ news: results.data.articles });
        //     })
        //     .catch(err => {
        //         console.log("error from news: ", err);
        //     });
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
    handleChange(e) {
        let value = e.target.value;
        console.log("value: ", value);
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => {
                console.log("this.state from handle change: ", this.state);
                axios
                    .post("/news/" + value, {
                        country: this.state.language,
                        category: this.state.category
                    })
                    .then(results => {
                        // console.log("results from news: ", results.data.articles);
                        // console.log("this.state from results news: ", this.state);
                        this.setState({ news: results.data.articles });
                    })
                    .catch(err => {
                        console.log("error from news: ", err);
                    });
            }
        );
        // console.log("name, value: ", name, value);
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
                            <div className="text-header">
                                <ProfilePic
                                    picture_url={this.state.picture_url}
                                    first={this.state.first}
                                    last={this.state.last}
                                    animataionFalse={() =>
                                        this.animataionFalse()
                                    }
                                />
                                <ul>
                                    <li>
                                        <Link className="dropdown" to="/">
                                            <i
                                                style={{ color: "black " }}
                                                className="fas fa-arrow-down"
                                            ></i>
                                        </Link>
                                        <ul>
                                            <li>
                                                <Link to="/friends">
                                                    <i className="fas fa-users"></i>{" "}
                                                    Friends
                                                </Link>
                                            </li>{" "}
                                            <li>
                                                <Link to="/users">
                                                    <i className="fas fa-search"></i>{" "}
                                                    Search
                                                </Link>
                                            </li>{" "}
                                            <li>
                                                <Link to="/edit">
                                                    <i className="fas fa-user-edit"></i>{" "}
                                                    Edit
                                                </Link>
                                            </li>{" "}
                                            <li>
                                                <Link to="/mypictures">
                                                    <i className="far fa-images"></i>{" "}
                                                    Album
                                                </Link>
                                            </li>{" "}
                                            <li onClick={e => this.logout(e)}>
                                                <a>
                                                    <i className="fas fa-sign-out-alt"></i>{" "}
                                                    Log out
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
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
                        <Route exact path="/chat/" component={Chat} />
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
                        {this.state.news && (
                            <div className="allnewsmain">
                                <p
                                    className="news-title"
                                    style={{
                                        textAlign: "center",
                                        color: "red",
                                        textDecoration: "underline"
                                    }}
                                >
                                    News Feed
                                </p>
                                <label htmlFor="language">
                                    Choose a language:
                                </label>
                                <select
                                    name="language"
                                    id="language"
                                    onChange={e => this.handleChange(e)}
                                >
                                    <option name="us" value="us">
                                        English
                                    </option>
                                    <option name="il" value="il">
                                        Hebrew
                                    </option>
                                    <option name="fr" value="fr">
                                        French
                                    </option>
                                    <option name="in" value="in">
                                        Hindi
                                    </option>
                                    <option name="pt" value="pt">
                                        Portuguese
                                    </option>
                                    <option name="cn" value="cn">
                                        Mandarin
                                    </option>
                                    <option name="ru" value="ru">
                                        Russia
                                    </option>
                                </select>

                                <label htmlFor="category">
                                    Choose a category:
                                </label>
                                <select
                                    name="category"
                                    id="category"
                                    onChange={e => this.handleChange(e)}
                                >
                                    <option>General</option>
                                    <option>Business</option>
                                    <option>Entertainment</option>
                                    <option>Science</option>
                                    <option>Health</option>
                                    <option>Sports</option>
                                    <option>Technology</option>
                                </select>
                                <div className="allnews">
                                    {this.state.news.map((singleNews, key) => (
                                        <div className="news" key={key}>
                                            <p
                                                style={{
                                                    textDecoration: "underline",
                                                    color: "crimson",
                                                    textAlign: "center"
                                                }}
                                            >
                                                <br />
                                                {singleNews.title}
                                            </p>
                                            <p>
                                                {singleNews.description}
                                                <br />
                                            </p>
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href={singleNews.url}
                                            >
                                                Read full article
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

// {this.state.news && <News />}
