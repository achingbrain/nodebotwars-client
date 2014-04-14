var DNode = require('dnode'),
  EventEmitter = require('events').EventEmitter,
  util = require('util');

var Client = function(config) {
  EventEmitter.call(this);

  this._config = config;

  var id;
  var self = this;

  var d = DNode.connect(this._config.rpc.port, function(remote) {
    remote.connect(this, function(error, playerId) {
      if(error) {
        throw error;
      }

      console.info("Connected to game server, allocated id", playerId);

      id = playerId;

      self.emit("connected");
    });
  });
  d.on('error', function(error) {
    console.error('got error', error);
  });
  d.on('fail', function(error) {
    console.error('got fail', error);
  });
  d.on('end', function() {
    console.error('got end');
  });
}
util.inherits(Client, EventEmitter);

module.exports = Client;
