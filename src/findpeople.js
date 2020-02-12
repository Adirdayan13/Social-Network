import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState("");
    const [joined, setJoined] = useState("");

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                console.log("try !");
                if (user != "") {
                    const { data } = await axios.get(
                        "/users/" + user + ".json"
                    );
                    if (!ignore) {
                        setUsers(data);
                        setJoined(false);
                    }
                } else {
                    setUsers([]);
                    const { data } = await axios.get("/users/newestUsers");

                    setUsers(data);
                    setJoined(true);
                }
            } catch (e) {
                console.log(e);
            }
        })();
        return () => {
            ignore = true;
        };
    }, [user]);

    // useEffect(() => {
    //     axios
    //         .get("users/" + country + ".json")
    //         .then(({ data }) => {
    //             setCountries(data);
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         });
    // }, [country]);

    // const onChange = ({ target }) => {
    //     // console.log('target: ', target);
    //     setGreetee(target.value);
    // };

    const showProfile = a => {
        location.replace("/user/" + a);
    };

    const onCountryChange = ({ target }) => {
        setUser(target.value);
    };

    console.log("users: ", users);
    console.log("joined: ", joined);
    return (
        <div className="find-people">
            <h2>Search for friends</h2>
            <input
                onChange={onCountryChange}
                type="text"
                placeholder="Search for friends"
            />
            {joined && <p>Checkout who just joined</p>}
            <div className="all-pictures-div">
                {users.map((user, index) => {
                    return (
                        <div className="picture-div" key={index}>
                            <p className="full-name-picture">
                                {user.first} {user.last}
                            </p>
                            {user.picture_url && (
                                <img
                                    onClick={() => showProfile(user.id)}
                                    className="picture-search"
                                    src={user.picture_url}
                                />
                            )}
                            {!user.picture_url && (
                                <img
                                    onClick={() => showProfile(user.id)}
                                    className="picture-search"
                                    src="/pictures/default.png"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
