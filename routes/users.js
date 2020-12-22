const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { encryptPassword } = require("../utility");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch {
    res.status(400).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    res.status(200).send(user);
  } catch {
    res.status(400).send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const savedUser = await User.create(req.body);
    res.status(201).send(savedUser);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const password = await encryptPassword(req.body.password);
    req.body.password = password;

    const updatedUser = await User.findOneAndReplace(
      { _id: req.params.id },
      req.body
    );

    res.status(200).send(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updatedUser = await User.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.patch("/:id/resetPassword", async (req, res) => {
  try {
    const password = await encryptPassword(req.body.password);

    const updatedUser = await User.updateOne(
      { _id: req.params.id },
      { $set: { password } }
    );

    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.remove({ _id: req.params.id });
    res.status(200).send(deletedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    console.log(username);
    console.log(password);

    const user = await User.findOne({ username: username });

    console.log(user);

    bcrypt.compare(password, user.password, async function (err, isMatch) {
      if (err)
        res
          .status(400)
          .send("Validation Error, Username or Password is incorrect.");
      if (!isMatch) {
        res
          .status(400)
          .send("Validation Error, Username or Password is incorrect.");
      } else {
        const token = await jwt.sign(
          { _id: user._id, role: user.accessLevel },
          JWT_KEY
        );
        res.set("auth", token);
        res.set("Access-Control-Expose-Headers", "auth");
        res.status(200).json(user);
      }
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
