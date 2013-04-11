/* jshint node: true */

window.addEventListener("load", function () {
  var chat = (function (el, host) {
    "use strict";

    var socket;

    var chatDom = (function (chatRoot) {
      var container = document.getElementById(chatRoot);
      var login     = document.getElementById("login");
      return {
        nickname: login.querySelector(".nickname"),
        connect:  login.querySelector(".connect"),
        display:  container.querySelector(".display"),
        users:    container.querySelector(".users"),
        input:    container.querySelector(".input"),
        send:     container.querySelector(".send")
      };
    }(el));

    var displayMessage = function (message) {
      console.log(message);
      var output = document.createElement("div");
      output.className = "comment";
      var user = document.createElement("div");
      user.className = "user";
      user.innerHTML = message.user;
      output.appendChild(user);
      var copy = document.createElement("div");
      copy.className = "copy";
      copy.innerHTML = message.message;
      output.appendChild(copy);

      chatDom.display.appendChild(output);
    };

    var updateUsers = function (data) {
      var userdiv;
      // sure there's not a better way to do this?
      chatDom.users.innerHTML = '';
      for (var i = 0, len = data.length; i < len; i++) {
        userdiv = document.createElement("div");
        userdiv.classname = "user";
        userdiv.innerHTML = data[i];
        chatDom.users.appendChild(userdiv);
      }
    };

    var handleSubmit = function (e) {
      var input = chatDom.input.value;
      if (input) {
        socket.emit("newMessage", {message: input});
      }
      chatDom.input.value = '';
      return false;
    };

    var handleConnect = function () {
      if (!chatDom.nickname.value) {
        return;
      }

      socket = window.io.connect("http://localhost:1337");

      socket.on("pushMessage", displayMessage);
      socket.on("connect", function () {
        console.log('connect event');
        socket.emit("setNickname", chatDom.nickname.value);
      });
      socket.on("initConversation", function (data) {
        for (var i = 0, len = data.length; i < len; i++) {
          displayMessage(data[i]);
        }
      });
      socket.on("updateUserList", updateUsers);
    };

    var addChatEventListeners = function () {
      chatDom.connect.addEventListener("click", handleConnect, false);
      chatDom.send.addEventListener("click", handleSubmit, false);
    };
    addChatEventListeners();

  }("conversation"));
}, false);
