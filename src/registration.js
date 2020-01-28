import React from "react";
import axios from "axios";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
            [e.target.last]: e.target.value,
            [e.target.email]: e.target.value,
            [e.target.password]: e.target.value
        });
    }
    submit() {
        axios
            .post("/register", {
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                //it worked
                console.log("data: ", data);
                if (data.success) {
                    console.log("post register worked");
                    location.replace("/");
                } else {
                    // failure!
                    console.log("post register didnt worked");
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(err => {
                console.log("error from POST register: ", err);
                this.setState({
                    error: true
                });
            });
    }
    render() {
        return (
            <div className="registration-wrapper">
                <div className="logo-div">
                    <img
                        className="logo-img-register"
                        src="/pictures/logo.png"
                    ></img>
                </div>
                <div className="registration-inputs">
                    {this.state.error && (
                        <p className="error">
                            Something went wrong, please try again.
                        </p>
                    )}
                    <input
                        className="first"
                        name="first"
                        placeholder="First name"
                        onChange={e => this.handleChange(e)}
                    />

                    <input
                        className="last"
                        name="last"
                        placeholder="Last name"
                        onChange={e => this.handleChange(e)}
                    />

                    <input
                        className="email"
                        name="email"
                        placeholder="Email"
                        onChange={e => this.handleChange(e)}
                    />

                    <input
                        className="password"
                        name="password"
                        placeholder="Password"
                        type="password"
                        onChange={e => this.handleChange(e)}
                    />
                    <button
                        className="submit-btn-register"
                        onClick={e => this.submit()}
                    >
                        Register &nbsp;&nbsp;<i className="fas fa-users"></i>
                    </button>
                    <br></br>
                    <p>
                        Sign Up
                        <br></br>
                        It’s quick and easy.
                    </p>
                </div>
            </div>
        );
    }
}
