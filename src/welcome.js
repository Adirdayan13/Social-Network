import React from "react";
import Registration from "./registration";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login";

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route exact path="/login" component={Login} />
                </div>
            </HashRouter>
        );
    }
}
