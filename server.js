const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set("port", process.env.PORT || 3001);

// make socketio available to all our routes
app.set('socketio', io);

// serve static assets in production - otherwise React server handles asset serving
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

http.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});

/////////////
//// routes
/////////////
require('./server/routes/routes.js')(app);

/////////////
//// sockets
/////////////
require('./server/socket.js')(io);

