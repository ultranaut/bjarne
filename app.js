/* jshint node: true */

var WebSocketServer = require('websocket').server;
var express = require('express');


var app = express.createServer();
app.configure(function () {
  app.use(express.static(__dirname + "/public"));
  app.set('views', __dirname);
});
app.listen(8080);


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

console.log("Chat is go...");
