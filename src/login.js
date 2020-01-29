import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
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
            .post("/login", {
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                //it worked
                console.log("data: ", data);
                if (data.success) {
                    console.log("post login worked");
                    location.replace("/");
                } else {
                    // failure!
                    console.log("post login didnt worked");
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(err => {
                console.log("error from POST login: ", err);
                this.setState({
                    error: true
                });
            });
    }
    render() {
        return (
            <div className="all-login">
                <div className="logo-div">
                    <img
                        className="logo-img-welcome"
                        src="/pictures/logo.png"
                    />
                </div>

                <div className="inputs-login">
                    <input
                        name="email"
                        className="email-error"
                        placeholder="Enter your Email"
                        autoComplete="off"
                        onChange={e => this.handleChange(e)}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        className="password-error"
                        placeholder="Enter your Password"
                        autoComplete="off"
                        onChange={e => this.handleChange(e)}
                        required
                    />
                    <br></br>
                    <button
                        className="submit-btn-register"
                        onClick={() => this.submit()}
                    >
                        Login &nbsp;&nbsp;
                        <i className="fas fa-users"></i>
                    </button>
                    <Link to="/">Click here to register!</Link>
                </div>
            </div>
        );
    }
}
