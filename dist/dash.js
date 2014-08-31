(function() {
  var Dash;

  Dash = (function() {
    Dash.prototype.socket = null;

    Dash.prototype.isConnected = false;

    function Dash() {}

    Dash.prototype.connect = function(port, address) {
      if (address == null) {
        address = "localhost";
      }
      this.socket = new WebSocket("ws://" + address + ":" + port + "/ws");
      this.socket.onopen = function(oe) {
        return console.log("connected.");
      };
      this.socket.onclose = function(ce) {
        console.log("connection closed.");
        return this.isConnected = false;
      };
      this.socket.onmessage = function(message) {
        console.log(message.data);
        return this.isConnected = false;
      };
      this.socket.onerror = function(err) {
        return console.log("Error!");
      };
      return this.isConnected = true;
    };

    Dash.prototype.send = function(key, data, cb) {
      if (cb == null) {
        cb = function(obj) {};
      }
      return this.socket.send(JSON.stringify({
        key: key,
        value: data
      }));
    };

    return Dash;

  })();

  module.exports = Dash;

}).call(this);
