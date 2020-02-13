import React from "react";
import axios from "./axios";
import FriendButton from "./friendButton";

export default class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
        // console.log("this.state from otherprofile: ", this.state);
    }

    componentDidMount() {
        //here we want to make a request to the server to get
        // all the info about the requested user (dynamic route)

        // console.log("this.props.match.params.id: ", this.props.match.params.id);

        // we want the server to send back all info about requested user
        // and the id of the currently logged in user
        // if there are the same we need to redirect the, back to the "/"

        axios
            .get("/user/" + this.props.match.params.id + ".json")
            .then(results => {
                console.log("results from getUserById: ", results);
                if (this.props.match.params.id == results.data.currentId) {
                    this.props.history.push("/");
                } else {
                    this.setState({
                        userInfo: results.data.userInfo,
                        myId: results.data.currentId
                    });
                }
            })
            .catch(err => {
                console.log("error from getUserById: ", err);
            });
    }

    render() {
        return (
            <div className="otherprofile">
                {this.state.userInfo && (
                    <div className="all-other-profile">
                        <img
                            className="other-user-profile-pic"
                            src={
                                this.state.userInfo.picture_url
                                    ? this.state.userInfo.picture_url
                                    : "/pictures/default.png"
                            }
                        />
                        <p className="other-user-info">
                            {this.state.userInfo.first}{" "}
                            {this.state.userInfo.last}
                            <br />
                            {this.state.userInfo.bio}
                        </p>
                        <br />
                        <FriendButton
                            sender_Id={this.state.myId}
                            recipient_id={this.props.match.params.id}
                            first={this.state.userInfo.first}
                        />
                        <br />
                    </div>
                )}
                {!this.state.userInfo && <p>User does not exist</p>}
            </div>
        );
    }
}
