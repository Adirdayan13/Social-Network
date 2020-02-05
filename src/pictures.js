import React from "react";
import axios from "./axios";

export default class Pictures extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pictures: []
        };
    }
    componentDidMount() {
        axios
            .get("/pictures")
            .then(results => {
                for (var i = 0; i < results.data.length; i++) {
                    let newState = { ...this.state };
                    newState.pictures.push(results.data[i].picture);
                    this.setState(newState);
                    console.log("results.data[i]", results.data[i].picture);
                }
            })
            .catch(err => {
                console.log("error from get pictures: ", err);
            });
    }
    grabFile(e) {
        this.setState({
            [e.target.name]: e.target.files[0]
        });
    }
    clickHandler(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.file);
        // this.props.waitShow();
        // this.props.noError();

        axios
            .post("/upload-album", formData)
            .then(results => {
                console.log("results from upload album: ", results.data);
                // this.props.waitHide();
                // this.props.noError();
                this.setState({
                    pictures: [results.data, ...this.state.pictures]
                });
            })
            .catch(err => {
                console.log("error from POST upload: ", err);
                // this.props.waitHide();
                // this.props.error();
            });
    }

    render() {
        console.log("this.state from pictures: ", this.state);

        return (
            <div className="pictures">
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
                <div className="album">
                    {this.state.pictures && (
                        <div>
                            {this.state.pictures.map((picture, index) => (
                                <img
                                    key={index}
                                    className="pictures-album"
                                    src={picture}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
