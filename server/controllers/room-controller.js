const _ = require('lodash');
let rooms = {}; // fake storage

const roomController = {
  getRoom: (roomId) => {
    return rooms[roomId];
  },

  createRoom: (roomId) => {
    let room = {
      chatRoomId: roomId,
      name: roomId, // in case we want to change the name later
      users: [],
      userCount: 0 // don't track users in room; track all-time user count so we can keep unique names in room
    };

    rooms[roomId] = room;
    return room;
  },

  addUser: (user, roomId) => {
    rooms[roomId].users.push(user);
    rooms[roomId].userCount++;
  },

  getUsers: (roomId) => {
    return rooms[roomId].users;
  },

  getNumUsers: (roomId) => {
    return roomController.getUsers(roomId).length;
  },

  getNextUserId: (roomId) => {
    return rooms[roomId].userCount + 1;
  },

  removeUser: (id, roomId) => {
    let room = rooms[roomId];
    let removed = _.remove(room.users, (user) => {
      return user.id === id;
    });

    return removed;
  },

  deleteRoom: (roomId) => {
    delete rooms[roomId];
  }

}

module.exports = roomController;
