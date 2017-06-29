const userController = require('./controllers/user-controller.js');
const roomController = require('./controllers/room-controller.js');
const messageController = require('./controllers/message-controller.js');
let sockets = {};

// TODO: could include a sockets controller as this gets large
module.exports = (io) => {
  // io.on('connection', require('./server/routes/socket.js'));
  io.on('connection', socket => {
    // join rooms
    socket.on('join_room', (chatRoomId) => {
      if (!roomController.getRoom(chatRoomId)) {
        return;
      }

      socket.join('chat_room_' + chatRoomId);

      let nextId = roomController.getNextUserId(chatRoomId);
      let user = userController.createDefaultUser(chatRoomId, socket.id, nextId);
      roomController.addUser(user, chatRoomId);
      socket.user = user;

      // provide joining user with current roomdata
      socket.emit('room_data', {
        user: user,
        messages: messageController.getMessages(chatRoomId),
        users: roomController.getUsers(chatRoomId)
      });

      // let everyone know someone joined
      io.sockets.in("chat_room_" + chatRoomId)
        .emit('new_user', { user: user });
    });

    socket.on('disconnect', () => {
      if (!roomController.getRoom(socket.user.chatRoomId)) {
        // if the room is already gone, just try to delete the user and exit
        userController.deleteUser(socket.user.id);
        return;
      }

      // remove user from room and delete user object
      roomController.removeUser(socket.user.id, socket.user.chatRoomId);
      userController.deleteUser(socket.user.id);

      // let everyone know someone left
      io.sockets.in("chat_room_" + socket.user.chatRoomId)
        .emit('user_left', { userId: socket.user.id });

      // delete room and its messages if last user signs out
      if (roomController.getRoom(socket.user.chatRoomId) && roomController.getNumUsers(socket.user.chatRoomId) === 0) {
        roomController.deleteRoom(socket.user.chatRoomId);
        messageController.deleteMessages(socket.user.chatRoomId);
      }
    });

  });

};

