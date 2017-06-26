const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller.js');

router.post("/user", (req, res) => {
  let user = req.body;

  // put the thing in the data store
  userController.createUser(user);

  console.log(userController.getUsers(user.chatRoomId));

  res.sendStatus(200);
});

router.get("/users", (req, res) => {
  let roomId = req.query.roomId,
      users = userController.getUsers(roomId);

  res.json(users);
});

module.exports = router;
