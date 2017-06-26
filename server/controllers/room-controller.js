const _ = require('lodash');
let rooms = []; // fake storage

const roomController = {
  getRoom: (roomId) => {

    console.log("rc getRoom", rooms);
    return _.find(rooms, (room) => {
      return room.chatRoomId === roomId;
    });
  },

  createRoom: (roomId) => {
    let room = {
      chatRoomId: roomId,
      name: roomId, // in case we want to change the name later
    };

    console.log('creating');
    rooms.push(room);
    return room;
  }

}


module.exports = roomController;
