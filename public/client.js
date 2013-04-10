/* jshint node: true */

function Chat(el, host) {
  "use strict";
  this.initChat(el);
  this.addChatEventListeners();
  //this.connect(host);
}

Chat.prototype.initChat = function (rootElement) {
  "use strict";
  var container = document.getElementById(rootElement);
  var login = document.getElementById("login");

  this.login = login;
  this.nickname = login.querySelector(".nickname");
  this.connect = login.querySelector(".connect");

  this.container = container;
  this.display   = container.querySelector(".display");
  this.users     = container.querySelector(".users");
  this.input     = container.querySelector(".input");
  this.send      = container.querySelector(".send");

};

Chat.prototype.addChatEventListeners = function () {
  "use strict";
  this.connect.addEventListener("click", this.handleConnect.bind(this), false);
  this.send.addEventListener("click", this.handleSubmit.bind(this), false);
};

Chat.prototype.handleConnect = function (host) {
  "use strict";

  if (!this.nickname.value) {
    return;
  }


  this.socket = io.connect("http://localhost:1337");

  this.socket.on("pushMessage", this.displayMessage.bind(this));
  this.socket.on("connect", function () {
    console.log(this.nickname.value);
    this.socket.emit("setNickname", this.nickname.value);
  }.bind(this));
  this.socket.on("initConversation", function (data) {
    for (var i = 0, len = data.length; i < len; i++) {
      this.displayMessage(data[i]);
    }
  }.bind(this));
  this.socket.on("updateUserList", function (data) {
    var userdiv;
    this.users.innerHTML = '';
    for (var i = 0, len = data.length; i < len; i++) {
      if (!data[i]) {
        continue;
      }
      userdiv = document.createElement("div");
      userdiv.classname = "user";
      userdiv.innerHTML = data[i];
      this.users.appendChild(userdiv);
    }

    console.debug(data);
  }.bind(this));
};

Chat.prototype.displayMessage = function (message) {
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

  this.display.appendChild(output);
};

Chat.prototype.handleSubmit = function (e) {
  "use strict";
  var input = this.input.value;
  if (input) {
    this.socket.emit("newMessage", {message: input});
  }
  this.input.value = '';
  return false;
};

/*
Chat.prototype.handleMessage = function (message) {
  "use strict";
  var data, init;
  try {
    data = JSON.parse(message.data);
  }
  catch (e) {
    // do nothing
  }

  if (data) {
    if (data.init) {
      console.debug(message.data);
      init = data.init;
      this.connectionId = init.connectionId;
      if (init.conversation) {
        for (var i = 0, len = init.conversation.length; i < len; i++) {
          var item = init.conversation[i];
          this.displayComment(item.msg);
        }
      }
    }
    else if (data.msg) {
      this.displayComment(data.msg);
    }
  }
};

Chat.prototype.displayComment = function (msg) {
  console.debug(msg);
  var output = document.createElement("div");
  output.className = "comment";
  var user = document.createElement("div");
  user.className = "user";
  user.innerHTML = msg.connectionId;
  output.appendChild(user);
  var copy = document.createElement("div");
  copy.className = "copy";
  copy.innerHTML = msg.copy;
  output.appendChild(copy);

  this.display.appendChild(output);
};

Chat.prototype.handleClose = function () {
  "use strict";
  //alert("WebSocket Connection Closed.");
};


*/
