import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    grabFile(e) {
        this.setState({
            [e.target.name]: e.target.files[0]
        });
    }

    clickHandler(e) {
        e.preventDefault();
        var formData = new FormData();
        this.props.waitShow();
        this.props.noError();

        formData.append("file", this.state.file);

        axios
            .post("/upload", formData)
            .then(results => {
                this.props.setImageUrl(results.data);
                this.props.animataionFalse();
                location.replace("/");
            })
            .catch(err => {
                console.log("error from POST upload: ", err);
                this.props.animataionFalse();
                this.props.error();
            });
    }

    render() {
        return (
            <div className="main-up">
                <div className="main-uploader">
                    <Link to="/">
                        <img className="x" src="/pictures/x.gif" />
                    </Link>
                    <br></br>
                    <br></br>
                    <p className="change-profile-text">
                        Want to change your profile picture ?
                    </p>
                    <form>
                        <input
                            type="file"
                            name="file"
                            id="file"
                            accept="image/*"
                            data-multiple-caption="{count} files selected"
                            multiple
                            onChange={e => this.grabFile(e)}
                        />
                        <label htmlFor="file">Choose a file</label>
                        <br></br>
                        <br></br>
                        <button
                            className="upload-btn"
                            onClick={e => this.clickHandler(e)}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}
