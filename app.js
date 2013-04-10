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
  var connections = [];
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
    connections.push(socket);
    socket.on("setNickname", function (name) {
      socket.set('nickname', name);
      socket.emit("initConversation", conversation);
      socket.emit("updateUserList", listUsers());
      socket.broadcast.emit("updateUserList", listUsers());
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

  function listUsers() {
    var userList = [];
    for (var i = 0, len = connections.length; i < len; i++) {
      if (connections[i].store.data.nickname) {
        userList.push(connections[i].store.data.nickname);
      }
    }
    return userList;
  }
  return server;
}(io));

console.log("Chat is go...");
