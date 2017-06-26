const express = require('express');
const router = express.Router();
const randomstring = require("randomstring");
const roomController = require('../controllers/room-controller.js');

router.post("/chat_room", (req, res) => {
  let body = req.body,
      roomId,
      existingRoom,
      returnRoom;

  if (body.roomId !== undefined) {
    // check whether room exists yet
    roomId = body.roomId;
    existingRoom = roomController.getRoom(roomId);
  } else {
    roomId = randomstring.generate();
  }

  if (!existingRoom) {
    returnRoom = roomController.createRoom(roomId);
  } else {
    returnRoom = existingRoom;
  }

  res.json({room: returnRoom});
});

router.get("/chat_room", (req, res) => {
  let roomId = req.query.chatRoomId,
      room;

  room = roomController.getRoom(roomId);

  res.json({room: room})
});

module.exports = router;
