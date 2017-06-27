const userController = require('./controllers/user-controller.js');
const roomController = require('./controllers/room-controller.js');
const messageController = require('./controllers/message-controller.js');
let sockets = {};

// TODO: could include a sockets controller as this gets large
module.exports = (io) => {
  // io.on('connection', require('./server/routes/socket.js'));
  io.on('connection', socket => {
    console.log("connection");

    // join rooms
    socket.on('join_room', (chatRoomId) => {
      socket.join('chat_room_' + chatRoomId);

      let nextId = roomController.getNextUserId(chatRoomId);
      let user = userController.createDefaultUser(chatRoomId, socket.id, nextId);
      roomController.addUser(user, chatRoomId);
      socket.user = user;

      socket.emit('room_data', {
        user: user,
        messages: messageController.getMessages(chatRoomId),
        users: roomController.getUsers(chatRoomId)
      });
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
      // remove user from room and delete user object
      roomController.removeUser(socket.user.id, socket.user.chatRoomId);
      userController.deleteUser(socket.user.id);

      // delete room and its messages if last user signs out
      if (roomController.getNumUsers === 0) {
        roomController.deleteRoom(socket.user.chatRoomId);
        messageController.deleteMessages(socket.user.chatRoomId);
      }
    });

  });

};

