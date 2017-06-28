const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller.js');

router.get("/users", (req, res) => {
  let roomId = req.query.roomId,
      users = userController.getUsers(roomId);

  res.json(users);
});

router.post("/user", (req, res) => {
  let user = req.body;

  // put the thing in the data store
  userController.createUser(user);

  res.json();
});

router.put("/user", (req, res) => {
  let params = req.body,
      user;

  if (params.id) {
    user = userController.getUser(params.id);
  }

  // raise error
  if (!user) {
    console.log("No user found!");
  }

  if (params.name) {
    // make sure no other user in the room has this name
    if (!userController.isNameValid(params.name, params.roomId)) {
      res.json({error: 'invalid_name'});
      return;
    }
    user.name = params.name;

    // update other users in the room
    let io = req.app.get('socketio'),
        chatRoomSocket = io.sockets.in("chat_room_" + user.chatRoomId);
    chatRoomSocket.emit('update_user', { user: user });
  }

  res.json(user);
});

module.exports = router;
