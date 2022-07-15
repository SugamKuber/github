import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { commits } from "./requests";
import Card from "react-bootstrap/Card";
import LoggedInTopBar from "./LoggedInTopBar";
import qs from "qs";
import moment from 'moment';
// const querystring = require("querystring");
function CommitsPage({ location }) {
    const [initialized, setInitialized] = useState(false);
    const [repoCommits, setRepoCommits] = useState([]);
    const getCommits = async page => {
        const repoName = qs.decode(location.search)["?repo"];
        const response = await commits(repoName, page);
        setRepoCommits(response.data.data);
    };
    useEffect(() => {
        if (!initialized) {
            getCommits(1);
            setInitialized(true);
        }
    });
    return (
        <>
            <LoggedInTopBar />
            <div className="page">
                <h1 className="text-center">Commits</h1>
                {repoCommits.map(rc => {
                    return (
                        <Card style={{ width: "90vw", margin: "0 auto" }}>
                            <Card.Body>
                                <Card.Title>{rc.commit.message}</Card.Title>
                                <p>Message: {rc.commit.message}</p>
                                <p>Author: {rc.author.login}</p>
                                <p>
                                    Date:{" "}
                                    {moment(rc.commit.author.date).format("dddd, MMMM Do YYYY, h:mm:ss a")}
                                </p>
                                <p>Hash: {rc.sha}</p>
                            </Card.Body>
                        </Card>
                    );
                })}
            </div>
        </>
    );
}
export default withRouter(CommitsPage);