import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        console.log("this.props: ", this.props);
    }
    grabFile(e) {
        this.setState({
            [e.target.name]: e.target.files[0]
        });
    }
    closeModal() {
        console.log("close modal");
        this.props.uploaderInvisible();
    }
    clickHandler(e) {
        e.preventDefault();

        var formData = new FormData();
        formData.append("file", this.state.file);

        axios
            .post("/upload", formData)
            .then(results => {
                this.props.setImageUrl(results.data);
            })
            .catch(err => {
                console.log("error from POST upload: ", err);
            });
    }

    render() {
        return (
            <div className="main-uploader">
                <img
                    className="x"
                    onClick={() => this.closeModal()}
                    src="/pictures/x.gif"
                />
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
        );
    }
}
// <button onClick={() => this.clickHandler()}></button>
// <button onClick={() => this.closeModal()}>X</button>
