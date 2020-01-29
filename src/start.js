import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";

let elem;
if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    elem = (
        <div>
            <div>
                <img className="logo-img-welcome" src="/pictures/logo.png" />
            </div>
            <p>success</p>
        </div>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
