import React from "react";
import axios from "./axios";

export default class News extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios
            .get("/news")
            .then(results => {
                // console.log("results from news: ", results.data);
                this.setState({ news: results.data.articles });
            })
            .catch(err => {
                console.log("error from news: ", err);
            });
    }

    handleChange(e) {
        let value = e.target.value;
        // console.log("value: ", value);
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => {
                // console.log("this.state from handle change: ", this.state);
                axios
                    .post("/news/" + value, {
                        country: this.state.language,
                        category: this.state.category
                    })
                    .then(results => {
                        // console.log("results from news: ", results.data.articles);
                        // console.log("this.state from results news: ", this.state);
                        this.setState({ news: results.data.articles });
                    })
                    .catch(err => {
                        console.log("error from news: ", err);
                    });
            }
        );
        // console.log("name, value: ", name, value);
    }

    render() {
        return (
            <>
                {this.state.news && (
                    <div className="allnewsmain">
                        <div className="news-header">
                            <p
                                className="news-feed"
                                style={{
                                    textAlign: "center",
                                    color: "red",
                                    textDecoration: "underline"
                                }}
                            >
                                News Feed
                            </p>
                            <label htmlFor="language">Choose language:</label>
                            <select
                                name="language"
                                id="language"
                                onChange={e => this.handleChange(e)}
                            >
                                <option name="us" value="us">
                                    English
                                </option>
                                <option name="il" value="il">
                                    Hebrew
                                </option>
                                <option name="fr" value="fr">
                                    French
                                </option>
                                <option name="de" value="de">
                                    Deutch
                                </option>
                                <option name="in" value="in">
                                    Hindi
                                </option>
                                <option name="pt" value="pt">
                                    Portuguese
                                </option>
                                <option name="cn" value="cn">
                                    Mandarin
                                </option>
                                <option name="ru" value="ru">
                                    Russian
                                </option>
                            </select>

                            <label htmlFor="category">Choose category:</label>
                            <select
                                name="category"
                                id="category"
                                onChange={e => this.handleChange(e)}
                            >
                                <option>Technology</option>
                                <option>Business</option>
                                <option>Entertainment</option>
                                <option>Science</option>
                                <option>Health</option>
                                <option>Sports</option>
                            </select>
                        </div>
                        <div
                            className={
                                location.pathname == "/newscomp"
                                    ? "newscomp"
                                    : "allnews"
                            }
                        >
                            {this.state.news.map((singleNews, key) => (
                                <div
                                    className="news"
                                    style={{ margin: "10px" }}
                                    key={key}
                                >
                                    <p className="news-title">
                                        <br />
                                        {singleNews.title}
                                    </p>
                                    <br />
                                    <p style={{ fontFamily: "auto" }}>
                                        {singleNews.description}
                                        <br />
                                    </p>
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={singleNews.url}
                                    >
                                        Read full article
                                    </a>
                                    <br />
                                    {location.pathname == "/newscomp" && (
                                        <div className="news-img">
                                            <br />
                                            <img
                                                style={{
                                                    width: "90%"
                                                }}
                                                src={singleNews.urlToImage}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </>
        );
    }
}
