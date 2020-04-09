import React from "react";
import axios from "./axios";

export default class Pictures extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pictures: [],
            popup: false,
            pictureClicked: {}
        };
    }
    componentDidMount() {
        this.getPictures();
    }
    getPictures() {
        axios
            .get("/pictures")
            .then(results => {
                for (var i = 0; i < results.data.length; i++) {
                    let newState = { ...this.state };
                    newState.pictures.push(results.data[i]);
                    this.setState(newState);
                }
            })
            .catch(err => {
                console.log("error from get pictures: ", err);
            });
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    grabFile(e) {
        this.setState({
            [e.target.name]: e.target.files[0]
        });
    }
    clickHandler(e) {
        e.preventDefault();
        this.setState({ displayUploader: false, wait: true, error: false });
        var formData = new FormData();
        formData.append("file", this.state.file);
        formData.append("title", this.state.title);
        axios
            .post("/upload-album", formData)
            .then(results => {
                this.setState({
                    pictures: [results.data, ...this.state.pictures],
                    wait: false,
                    error: false
                });
            })
            .catch(err => {
                console.log("error from POST upload: ", err);
                this.setState({ wait: false, error: true });
            });
    }

    render() {
        return (
            <div className="pictures">
                {this.state.popup ? (
                    <div className="popup">
                        <div className="head-popup">
                            <span
                                className="x-popup"
                                onClick={() => this.setState({ popup: false })}
                            >
                                X
                            </span>
                            {this.state.pictureClicked.picture.title !==
                            "undefined" ? (
                                <p
                                    style={{
                                        marginTop: "1%",
                                        fontSize: "1.5rem"
                                    }}
                                >
                                    {this.state.pictureClicked.picture.title}
                                </p>
                            ) : null}
                        </div>
                        <img
                            className="picture-popup"
                            src={this.state.pictureClicked.picture.picture}
                        />
                    </div>
                ) : null}
                {!this.state.displayUploader && (
                    <p
                        onClick={() =>
                            this.setState({
                                displayUploader: true,
                                error: false,
                                wait: false
                            })
                        }
                    >
                        Upload picture to your album
                    </p>
                )}
                {this.state.wait && (
                    <div className="wait">
                        <img
                            className="loading-gif-pictures"
                            src="/pictures/loading.gif"
                        />
                    </div>
                )}
                {this.state.error && (
                    <p className="error-upload-pictures">somehing went wrong</p>
                )}
                {this.state.displayUploader && (
                    <form>
                        <br />
                        <input
                            onChange={e => this.handleChange(e)}
                            name="title"
                            id="title"
                            type="text"
                            placeholder="Title"
                            autoComplete="off"
                        />
                        <br />
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
                )}
                {this.state.pictures && (
                    <div className="album">
                        {this.state.pictures.map((picture, index) => (
                            <div key={index} className="pictures-album">
                                <img
                                    className="picture-album"
                                    onClick={() =>
                                        this.setState({
                                            popup: true,
                                            pictureClicked: { picture }
                                        })
                                    }
                                    src={picture.picture}
                                />
                                {picture.title !== "undefined" ? (
                                    <p>{picture.title}</p>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}
