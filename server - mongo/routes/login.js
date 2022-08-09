const dotenv = require("dotenv");
dotenv.config("../.env");

const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const userList = await userModel.find();
    res.status(200).send(userList);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", getUser, async (req, res) => {
  if (res.user != null) {
    const accessToken = jwt.sign(
      { id: res.user._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.status(201).json({ accessToken: accessToken });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new userModel({
      username: req.body.username,
      password: hashedPassword,
    });

    newUser.save();

    const accessToken = jwt.sign(
      { id: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.status(201).json({ accessToken: accessToken });
  } catch (err) {
    return res.status(500).json(err);
  }
});

async function getUser(req, res, next) {
  if (req.body === undefined) {
    res.status(500).send({ Error: "Missing body" });
    return;
  }
  if (req.body.username === undefined || req.body.password === undefined) {
    console.log("todo POST: invalid JSON format");
    res.status(500).send({ Error: "Invalid JSON format" });
    return;
  }
  if (
    typeof req.body.username !== "string" ||
    typeof req.body.password !== "string"
  ) {
    console.log("todo POST: wrong type");
    res.status(500).send({ Error: "Invalid type" });
    return;
  }
  let findUser = null;
  try {
    findUser = await userModel.findOne({ username: req.body.username });
    if (findUser != null) {
      if (!(await bcrypt.compare(req.body.password, findUser.password))) {
        return res.status(500).json({ message: "wrong password" });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = findUser;
  next();
}

module.exports = router;
