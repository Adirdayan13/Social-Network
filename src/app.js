import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        // console.log("this.state: ", this.state);
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
        console.log("this.state: ", this.state);
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
                <ProfilePic
                    clickHandler={() =>
                        this.setState({ uploaderIsVisible: true })
                    }
                    picture_url={this.state.picture_url}
                    first={this.state.first}
                    last={this.state.last}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader
                        setImageUrl={picture_url =>
                            this.setState({ picture_url })
                        }
                    />
                )}
            </div>
        );
    }
}
