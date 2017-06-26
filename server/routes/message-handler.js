const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message-controller.js');

// pseudo-post - we gots no db
router.post("/message", (req, res) => {
  let message = req.body,
      io = req.app.get('socketio');

  // put the thing in the data store
  messageController.postMessage(message);

  // send to all users in the room
  let chatRoomSocket = io.sockets.in("chat_room_" + message.chatRoomId);
  chatRoomSocket.emit('new_message', { message: message });

  res.sendStatus(200);
});

router.get("/messages", (req, res) => {
  let roomId = req.query.roomId,
      messages = messageController.getMessages(roomId);

  res.json(messages);
});

module.exports = router;
