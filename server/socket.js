// TODO: could include a sockets controller as this gets large
module.exports = (io) => {
  // io.on('connection', require('./server/routes/socket.js'));
  io.on('connection', socket => {
    console.log("connection");

    // join rooms
    socket.on('join_room', (chatRoomId) => {
      socket.join('chat_room_' + chatRoomId);
      let connections = 0;
      let ns = io.of('/');
      for (let id in ns.connected) {
        if(ns.connected[id].rooms['chat_room_' + chatRoomId]) {
          connections++;
        }
      }
      socket.emit('room_size', { size: connections });
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

  });

};

