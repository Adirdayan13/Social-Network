import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Reset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    submit() {
        axios
            .post("/reset/start", {
                email: this.state.email
            })
            .then(({ data }) => {
                console.log("data: ", data);
                if (data.success) {
                    console.log("success !");
                } else {
                    console.log("false !");
                }
            })
            .catch(err => {
                console.log("erro from POST reset: ", err);
            });
    }
    render() {
        return (
            <div>
                <p>We are in reset</p>
                <input
                    className="email"
                    name="email"
                    placeholder="Email"
                    onChange={e => this.handleChange(e)}
                />
                <br></br>
                <button
                    className="submit-btn-reset"
                    onClick={() => this.submit()}
                >
                    Reset password &nbsp;&nbsp;
                    <i className="fas fa-users"></i>
                </button>
            </div>
        );
    }
}
