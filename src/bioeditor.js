import React from "react";
import axios from "./axios";

export default class Bioeditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        console.log("this.props from Bioeditor : ", this.props);
    }
    clickHandler(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    submitBio(e) {
        e.preventDefault();
        console.log("submit clicked");
        console.log("this.state: ", this.state);
        axios
            .post("/bio", {
                bio: this.state.bio
            })
            .then(results => {
                console.log("results from POST bio: ", results);
                this.props.editBio(this.state.bio);
            })
            .catch(err => {
                console.log("error in POST bio: ", err);
            });
    }
    render() {
        console.log("this.state from BioEditor: ", this.state);
        return (
            <div className="profile">
                <h1>BioEditor</h1>
                <img
                    className="profile-pic-big"
                    src={this.props.picture_url}
                    onClick={e => this.props.clickHandler(e)}
                />
                <br></br>
                <textarea
                    onChange={e => this.clickHandler(e)}
                    className="bio"
                    type="text"
                    name="bio"
                />
                <br></br>
                <button onClick={e => this.submitBio(e)}>Submit</button>

                <div>
                    <h3></h3>
                </div>
            </div>
        );
    }
}

// {!this.props.bio &&
//     <div>Add bio:</div>
// }
// {this.props.bio && (
//     <div>Edit bio: {this.props.bio} </div>
// )}
