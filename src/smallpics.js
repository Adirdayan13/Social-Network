import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class SmallPictures extends React.Component {
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
                if (results.data.length >= 4) {
                    for (var i = 0; i < 4; i++) {
                        let newState = { ...this.state };
                        newState.pictures.push(results.data[i].picture);
                        this.setState(newState);
                    }
                } else {
                    for (var j = 0; j < results.data.length; j++) {
                        let newState = { ...this.state };
                        newState.pictures.push(results.data[j].picture);
                        this.setState(newState);
                    }
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
        this.props.waitShow();
        this.props.noError();
        axios
            .post("/upload-album", formData)
            .then(results => {
                this.props.waitHide();
                this.props.noError();
                this.setState({
                    pictures: [results.data, ...this.state.pictures]
                });
            })
            .catch(err => {
                console.log("error from POST upload: ", err);
                this.props.waitHide();
                this.props.error();
            });
    }

    render() {
        return (
            <div className="smallpictures">
                <>
                    <p style={{ color: "black" }}>My album</p>
                    {this.state.pictures && (
                        <>
                            {this.state.pictures.map((picture, index) => (
                                <img
                                    key={index}
                                    className="small-pictures-album"
                                    src={picture}
                                />
                            ))}
                        </>
                    )}
                    {this.state.pictures.length == 0 && (
                        <Link to="/mypictures">
                            <p>Upload your first picture</p>
                        </Link>
                    )}
                </>
            </div>
        );
    }
}
