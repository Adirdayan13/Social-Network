import React from "react";
import axios from "./axios";

export default class Bioeditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // console.log("this.props from Bioeditor : ", this.props);
    }
    clickHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
        console.log("this.props.bio: ", this.props.bio);
        console.log("************ths.state: ", this.state);
    }
    submitBio(e) {
        this.editFalse(e);

        e.preventDefault();
        console.log("this.state from submitBio: ", this.state);
        axios
            .post("/bio", {
                bio: this.state.bio
            })
            .then(results => {
                console.log("results from POST bio: ", results);
                console.log("this.state.bio: ", this.state.bio);
                this.props.editBio(this.state.bio);
            })
            .catch(err => {
                console.log("error in POST bio: ", err);
            });
    }
    editTrue(e) {
        console.log("editTrue");
        this.setState({
            edit: true
        });
    }
    editFalse(e) {
        console.log("editTrue");
        this.setState({
            edit: false
        });
    }
    render() {
        console.log("this.state from render: ", this.state);
        console.log("this.props.bio from render: ", this.props.bio);

        return (
            <div className="profile">
                <h1>BioEditor</h1>
                {!this.state.edit && (
                    <div>
                        {this.props.bio && (
                            <div className="bio">
                                <br></br>
                                <div onClick={e => this.editTrue(e)}>
                                    <div>My bio: {this.props.bio}</div>
                                    Click me to change bio
                                </div>
                            </div>
                        )}
                        {!this.props.bio && (
                            <div className="bio">
                                <div onClick={e => this.editTrue(e)}>
                                    Add bio:
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {this.state.edit && (
                    <div>
                        <textarea
                            onChange={e => this.clickHandler(e)}
                            className="bio"
                            type="text"
                            name="bio"
                            value={this.state.bio}
                        />
                        <br></br>
                        <button onClick={e => this.submitBio(e)}>Submit</button>
                    </div>
                )}
            </div>
        );
    }
}
