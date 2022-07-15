const express = require("express");
const models = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import { authCheck } from "../middlewares/authCheck";
const router = express.Router();
router.post("/signup", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await models.User.create({
      username,
      password: hashedPassword
    });
    res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const users = await models.User.findAll({ where: { username } });
  const user = users[0];
  const response = await bcrypt.compare(password, user.password);
  if (response) {
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  } else {
    res.status(401).json({});
  }
});
router.post("/changePassword", authCheck, async (req, res, next) => {
  const { password } = req.body;
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const id = decoded.userId;
  const hashedPassword = await bcrypt.hash(password, 10);
  await models.User.update({ password: hashedPassword }, { where: { id } });
  res.json({});
});
router.get("/currentUser", authCheck, async (req, res, next) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const id = decoded.userId;
  const users = await models.User.findAll({ where: { id } });
  const { username, gitHubUsername } = users[0];
  res.json({ username, gitHubUsername });
});
module.exports = router;