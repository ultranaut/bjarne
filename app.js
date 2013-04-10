/* jshint node: true */

var express = require('express');
var io = require('socket.io');

var app = express();
app.configure(function () {
  app.use(express.static(__dirname + "/public"));
  app.set('views', __dirname);
});
app.listen(8080);


var chatServer = (function (io) {
  var connectionId = 0;
  var connections = {};
  var conversation = [];

  var server = io.listen(1337);
  /*
   * level of detail output to logger
   * 0 - error
   * 1 - warn
   * 2 - info
   * 3 - debug (default)
   */
  server.set("log level", 2);
  server.sockets.on("connection", function (socket) {
    socket.on("setNickname", function (name) {
      socket.set('nickname', name);
      socket.emit("initConversation", conversation);
      console.log(this);
    });
    socket.on('newMessage', function (data) {
      socket.get("nickname", function (err, name) {
        var message = {user: name, message: data.message};
        conversation.push(message);
        /* TODO: do I really need to do this twice? */
        socket.emit("pushMessage", message);
        socket.broadcast.emit("pushMessage", message);
      });
    });
  });

  return server;
}(io));


/*
var chatServer = (function (httpServer) {
  var connectionId = 0;
  var conversation = [];

  var server = new WebSocketServer({
    httpServer: httpServer
  });

  server.on('request', function (request) {
    var connection = request.accept("chat", request.origin);

    console.log(connection.remoteAddress, "connected - Protocol Version", connection.webSocketVersion);

    var connectData = {};
    connectData.connectionId = "conn_" + connectionId++;
    connectData.conversation = conversation;

    // bring new connection up-to-date
    connection.sendUTF(JSON.stringify({init: connectData}));

    // Handle closed connections
    connection.on('close', function () {
      var connections = chatServer.connections;
      console.log(connection.remoteAddress + " disconnected");

      var index = connections.indexOf(connection);
      if (index !== -1) {
        connections.splice(index, 1);
      }
    });

    // Handle incoming messages
    connection.on('message', function (message) {
      if (message.type === 'utf8') {
        try {
          console.log("received: ", message);
          var comment = JSON.parse(message.utf8Data);
          chatServer.broadcast(message.utf8Data);
          conversation.push(JSON.parse(message.utf8Data));
        }
        catch (e) {
          console.log(e);
        }
      }
    });
  });

  return server;
}(app));
*/
console.log("Chat is go...");
