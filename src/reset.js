import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import Recaptcha from "react-recaptcha";

export default class Reset extends React.Component {
    constructor(props) {
        super(props);
        this.recaptcha = this.recaptcha.bind(this);
        this.recaptchaLoaded = this.recaptchaLoaded.bind(this);
        this.verifyCallback = this.verifyCallback.bind(this);
        this.state = {
            isVerified: false
        };
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    recaptcha() {
        if (this.state.isVerified) {
            this.submit();
        } else {
            alert("Please verify");
        }
    }
    recaptchaLoaded() {
        console.log("Recaptcha loaded");
    }
    verifyCallback(response) {
        console.log("checked");
        if (response) {
            this.setState({
                isVerified: true
            });
        }
    }
    submit() {
        this.setState({ error: false });
        console.log("this.state: ", this.state);
        console.log("this.state.step: ", this.state.step);
        axios
            .post("/reset/start", {
                email: this.state.email
            })
            .then(({ data }) => {
                console.log("data.success: ", data.success);
                if (data.success) {
                    this.setState({ step: 2 });
                } else if (data.success == false) {
                    this.setState({
                        step: undefined,
                        success: false,
                        error: true
                    });
                }
            })
            .catch(err => {
                console.log("erro from POST reset: ", err);
            });
    }
    changePass() {
        console.log("this.state: ", this.state);

        axios
            .post("/reset/verify", {
                state: this.state
            })
            .then(results => {
                console.log("results from POST reset/verify: ", results);
                console.log("data.success: ", results.data.success);
                console.log(
                    "results data success == false: ",
                    results.data.success == false
                );
                if (results.data.success) {
                    console.log("step: 3");
                    this.setState({ step: 3 });
                } else if (results.data.success == false) {
                    console.log("error: true");
                    this.setState({ error: true });
                } else {
                    console.log("step: 2");
                    this.setState({ step: 2 });
                }
            })
            .catch(err => {
                console.log("error from POST reset/verify", err);
            });
    }
    render() {
        console.log("this.state: ", this.state);
        return (
            <div className="reset">
                <Recaptcha
                    sitekey="6LfkedYUAAAAABgGDiNN5_wq7VmyR2azMdEr8Xnf"
                    render="explicit"
                    onloadCallback={this.recaptchaLoaded}
                    verifyCallback={this.verifyCallback}
                />
                {this.state.error && <p>something went wrong</p>}
                {this.state.step == undefined && (
                    <div className="no-step">
                        <p>Reset your password</p>
                        <br />
                        <input
                            className="email"
                            name="email"
                            placeholder="Email"
                            onChange={e => this.handleChange(e)}
                        />
                        <br />
                        <button
                            className="submit-btn-reset"
                            onClick={() => this.recaptcha()}
                        >
                            Reset password &nbsp;&nbsp;
                            <i className="fas fa-users"></i>
                        </button>
                        <br /> <br />
                        <Link to="/login">Click here to Log in!</Link>
                    </div>
                )}
                {this.state.step == 2 && (
                    <div>
                        <p>Please enter the code you recieved</p>
                        <input
                            className="code"
                            name="code"
                            placeholder="Code"
                            onChange={e => this.handleChange(e)}
                        />
                        <br></br>
                        <p>Please enter your new password</p>
                        <input
                            className="new-password"
                            name="newpassword"
                            type="password"
                            placeholder="Password"
                            onChange={e => this.handleChange(e)}
                        />
                        <br></br>
                        <button
                            className="submit-btn-reset"
                            onClick={() => this.changePass()}
                        >
                            Reset password &nbsp;&nbsp;
                            <i className="fas fa-users"></i>
                        </button>
                        <br />
                    </div>
                )}
                {this.state.step == 3 && location.replace("/welcome#/login")}
            </div>
        );
    }
}
