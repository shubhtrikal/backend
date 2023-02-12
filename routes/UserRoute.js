const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const Request = require("../models/RequestModel");

router.post("/register", async (req, res) => {
  const data = req.body;
  // console.log(data.role)
  const user = await User.findOne({ email: data.email });

  if (user) {
    console.log("User already exists");
    return res.status(400).json({ error: "User already exists" });
  } else {
    const user = new User({
      name: data.name,
      email: data.email,
      number: data.number,
      role: data.role,
      requests: [],
    });
    await user
      .save()
      .then((user) => {
        // console.log(user)
        return res.status(200).json(user);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  }
});

router.post("/login", async (req, res) => {
  const data = req.body;

  const user = await User.findOne({ email: data.email });
  if (user) {
    // console.log(user)
    return res.status(200).json(user);
  } else {
    console.log("User does not exist");
    return res.status(400).json({ error: "User does not exist" });
  }
});

router.post("/getDetail", async (req, res) => {
  const data = req.body;
  const user = await User.findOne({ _id: data._id });
  if (user) {
    // console.log(user)
    return res.status(200).json(user);
  } else {
    console.log("User does not exist");
    return res.status(400).json({ error: "User does not exist" });
  }
});

module.exports = router;
