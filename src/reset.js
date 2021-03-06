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
            alert("You are a robot ?");
        }
    }
    recaptchaLoaded() {}
    verifyCallback(response) {
        if (response) {
            this.setState({
                isVerified: true
            });
        }
    }
    submit() {
        this.setState({ error: false });
        axios
            .post("/reset/start", {
                email: this.state.email
            })
            .then(({ data }) => {
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
        axios
            .post("/reset/verify", {
                state: this.state
            })
            .then(results => {
                if (results.data.success) {
                    this.setState({ step: 3 });
                } else if (results.data.success == false) {
                    this.setState({ error: true });
                } else {
                    this.setState({ step: 2 });
                }
            })
            .catch(err => {
                console.log("error from POST reset/verify", err);
            });
    }
    render() {
        return (
            <div className="reset">
                <div className="logo-div-reset">
                    <img
                        style={{ width: "150px" }}
                        src="/pictures/logo.png"
                    ></img>
                </div>
                <div className="robotmain">
                    <img
                        style={{ width: "378px", height: "398px" }}
                        src="/pictures/robotV3.png"
                    />
                </div>
                <div className="robot">
                    <Recaptcha
                        className="recaptcha"
                        sitekey="6LfkedYUAAAAABgGDiNN5_wq7VmyR2azMdEr8Xnf"
                        render="explicit"
                        onloadCallback={this.recaptchaLoaded}
                        verifyCallback={this.verifyCallback}
                    />
                </div>
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
