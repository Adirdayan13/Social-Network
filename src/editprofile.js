import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class EditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    edit(e) {
        this.props.editHandler();
        e.preventDefault(e);
        axios
            .post("/edit", {
                email: this.state.email,
                first: this.state.first,
                last: this.state.last,
                id: this.props.id
            })
            .then(results => {
                if (results.data.success) {
                    this.props.setUpdate(
                        results.data.email,
                        results.data.first,
                        results.data.last
                    );
                    this.setState({ done: true });
                    this.props.closeEdit();
                    this.props.noError();
                    // location.replace("/");
                }
                if (!results.data.success) {
                    this.props.error();
                }
            })
            .catch(err => {
                console.log("Error from post edit: ", err);
                this.props.error();
            });
    }
    close(e) {
        e.preventDefault();
        this.props.closeEdit();
        this.props.noError();
    }
    render() {
        return (
            <div className="edit-profile">
                <p className="edit-profile-p">Edit your profile</p>
                {!this.state.done && (
                    <div className="edit-inputs">
                        <input
                            className="email"
                            name="email"
                            placeholder="Email"
                            onChange={e => this.handleChange(e)}
                        />
                        <input
                            className="first"
                            name="first"
                            placeholder="First"
                            onChange={e => this.handleChange(e)}
                        />
                        <input
                            className="last"
                            name="last"
                            placeholder="Last"
                            onChange={e => this.handleChange(e)}
                        />
                        <br />
                        <button onClick={e => this.edit(e)}>Submit</button>
                        <button>
                            <Link className="cancelBtn" to="/">
                                Cancel
                            </Link>
                        </button>
                    </div>
                )}
            </div>
        );
    }
}
