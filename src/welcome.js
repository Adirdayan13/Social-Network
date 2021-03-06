import React from "react";
import Registration from "./registration";
import Login from "./login";
import Reset from "./reset";
import { HashRouter, Route } from "react-router-dom";

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <HashRouter>
                <div className="welcome-main-div">
                    <div className="registration-main-div"></div>
                    <Route exact path="/" component={Registration} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/reset/start" component={Reset} />
                </div>
            </HashRouter>
        );
    }
}
