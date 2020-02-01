import React from "react";
import BioEditor from "./bioeditor";

// import axios from "./axios";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        console.log("this.props from Profile : ", this.props);
    }
    render() {
        return (
            <div className="profile">
                <img
                    className="profile-pic-big"
                    src={this.props.picture_url}
                    onClick={this.props.clickHandler}
                />
                <div>
                    <h3>
                        <div className="BioEditor">
                            <BioEditor
                                picture_url={this.props.picture_url}
                                first={this.props.first}
                                last={this.props.last}
                                bio={this.props.bio}
                                editBio={this.props.editBio}
                                clickHandler={() =>
                                    this.setState({
                                        uploaderIsVisible: true
                                    })
                                }
                            />
                        </div>
                    </h3>
                </div>
            </div>
        );
    }
}
