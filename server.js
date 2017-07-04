const express = require("express");
const bodyParser = require('body-parser');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);

app.set("port", process.env.PORT || 3001);

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// make socketio available to all our routes
app.set('socketio', io);

// serve static assets in production - otherwise React server handles asset serving
if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname + "/client/build"));
}

/////////////
//// routes
/////////////
app.use(require('./server/index.js'));
app.get('/*', function (req, res) {
  console.log("RENDING CHAT 1!", __dirname + '/client/build/index.html');
  res.sendFile(__dirname + '/client/build/index.html');
});

// app.get('/chat/:id', function (req, res) {
//   console.log("RENDING CHAT 2!");
//   res.render(__dirname + '/client/build/');
// });

// serve index file on all routes
app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/client/build/index.html');
});

/////////////
//// sockets
/////////////
require('./server/socket.js')(io);

server.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`);
});
