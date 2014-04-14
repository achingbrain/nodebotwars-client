var DNode = require('dnode');

var Client = function(config) {
  this._config = config;

  DNode.connect(this._config.rpc.port, function(remote) {
    remote.connect(this, this.connected.bind(this));
  }.bind(this));
}

Client.prototype.connected = function(error, id) {
  console.info("Connected to game server, allocated id", id);

  this._id = id;
}

module.exports = Client;
