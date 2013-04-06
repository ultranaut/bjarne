function Chat(el, host) {
  "use strict";
  this.initChat(el);
  this.connect(host);
}

Chat.prototype.connect = function (host) {
  "use strict";

  // if host is provided use that, otherwise use the document's url
  var url = "ws://" + (host || document.URL.substr(7).split('/')[0]);

  var WebSocket = window.MozWebSocket ? window.MozWebSocket : window.WebSocket;
  this.socket = new WebSocket(url, "chat");
  this.socket.onmessage = this.handleMessage.bind(this);
  this.socket.onclose = this.handleClose.bind(this);

  this.send.addEventListener("click", this.handleSubmit.bind(this), false);
};

Chat.prototype.handleMessage = function (message) {
  "use strict";
  var data;
  try {
    data = JSON.parse(message.data);
  }
  catch (e) {
    /* do nothing */
  }

  if (data) {
    if (data.conversation) {
      for (var i = 0, len = data.conversation.length; i < len; i++) {
        var item = data.conversation[i];
        this.displayComment(item.msg);
      }
    }
    else if (data.msg) {
      this.displayComment(data.msg);
    }
  }
};

Chat.prototype.displayComment = function (msg) {
  var output = document.createElement("div");
  output.className = "comment";
  var user = document.createElement("div");
  user.className = "user";
  user.innerHTML = msg.user;
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

Chat.prototype.initChat = function (el) {
  "use strict";
  var container = document.getElementById(el);

  this.container = container;
  this.display   = container.querySelector(".display");
  this.input     = container.querySelector(".input");
  this.send      = container.querySelector(".send");
};

Chat.prototype.handleSubmit = function (e) {
  "use strict";
  var input = this.input.value;
  if (input) {
    var message = {
      msg: {
        user: "john",
        copy: input
      }
    };
    this.socket.send(JSON.stringify(message));
  }
  this.input.value = '';
};

Chat.prototype.addChatEventListeners = function () {
  "use strict";
};
