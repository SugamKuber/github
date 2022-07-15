var express = require("express");
const models = require("../models");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Octokit = require("@octokit/rest");
import { authCheck } from "../middlewares/authCheck";
var router = express.Router();
router.post("/setGithubCredentials", authCheck, async (req, res, next) => {
    const { gitHubUsername, gitHubPassword } = req.body;
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.userId;
    const cipherText = CryptoJS.AES.encrypt(
        gitHubPassword,
        process.env.CRYPTO_SECRET
    );
    await models.User.update(
        {
            gitHubUsername,
            gitHubPassword: cipherText.toString()
        },
        {
            where: { id }
        }
    );
    res.json({});
});
router.get("/repos/:page", authCheck, async (req, res, next) => {
    const page = req.params.page || 1;
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.userId;
    const users = await models.User.findAll({ where: { id } });
    const user = users[0];
    const bytes = CryptoJS.AES.decrypt(
        user.gitHubPassword.toString(),
        process.env.CRYPTO_SECRET
    );
    const password = bytes.toString(CryptoJS.enc.Utf8);
    const octokit = new Octokit({
        auth: {
            username: user.gitHubUsername,
            password
        }
    });
    console.log(user.gitHubUsername);
    const data = await octokit.repos.list({
        username: user.gitHubUsername,
        page
    });
    res.json(data);
});
router.get("/commits/", authCheck, async (req, res, next) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.userId;
    const users = await models.User.findAll({ where: { id } });
    const user = users[0];
    const repoPath = req.query.repo;
    const bytes = CryptoJS.AES.decrypt(
        user.gitHubPassword.toString(),
        process.env.CRYPTO_SECRET
    );
    const password = bytes.toString(CryptoJS.enc.Utf8);
    const octokit = new Octokit({
        auth: {
            username: user.gitHubUsername,
            password
        }
    });
    const [owner, repo] = repoPath.split("/");
    const data = await octokit.repos.listCommits({
        owner,
        repo
    });
    res.json(data);
});
module.exports = router;