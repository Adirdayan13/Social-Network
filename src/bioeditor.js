import React from "react";
import axios from "./axios";

export default class Bioeditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: this.props.bio
        };
    }
    clickHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
        // console.log("e.target.name: ", e.target.name);
        // console.log("this.props.bio: ", this.props.bio);
        // console.log("************ths.state: ", this.state);
    }
    submitBio(e) {
        this.editFalse();

        e.preventDefault();
        // console.log("this.state from submitBio: ", this.state);
        axios
            .post("/bio", {
                bio: this.state.bio
            })
            .then(results => {
                console.log("results from POST bio: ", results);
                // console.log("this.state.bio: ", this.state.bio);
                this.props.editBio(this.state.bio);
            })
            .catch(err => {
                console.log("error in POST bio: ", err);
            });
    }
    editTrue() {
        this.setState({
            edit: true
        });
    }
    editFalse() {
        this.setState({
            edit: false
        });
    }
    render() {
        // console.log("this.state from render: ", this.state);
        // console.log("this.props.bio from render: ", this.props.bio);

        return (
            <>
                {!this.state.edit && (
                    <>
                        {this.props.bio && (
                            <div className="bio-div">
                                <p className="bio-text">
                                    {this.props.bio}&nbsp;&nbsp;
                                </p>
                                <br />
                                <br />
                                <p
                                    className="edit-in-bio"
                                    onClick={() => this.editTrue()}
                                >
                                    Edit
                                </p>
                            </div>
                        )}
                        {!this.props.bio && (
                            <>
                                <div
                                    className="add-in-bio"
                                    onClick={() => this.editTrue()}
                                >
                                    <br />
                                    <p style={{ textDecoration: "underline" }}>
                                        Add your bio now
                                    </p>
                                </div>
                            </>
                        )}
                    </>
                )}
                {this.state.edit && (
                    <div className="textarea">
                        <textarea
                            onChange={e => this.clickHandler(e)}
                            className="bio"
                            type="text"
                            name="bio"
                            defaultValue={this.state.bio}
                        />
                        <br></br>
                        <button
                            className="save"
                            onClick={e => this.submitBio(e)}
                        >
                            Save
                        </button>
                    </div>
                )}
            </>
        );
    }
}
