var DNode = require('dnode'),
  EventEmitter = require('events').EventEmitter,
  util = require('util'),
  check = require('check-types'),
  TYPES = require('./TYPES'),
  SHIELDS = require('./SHIELDS');

var Client = function(options) {
  EventEmitter.call(this);
  /*
   check.verify.object(options, "Please supply a config object");
   check.verify.object(options.ir, "Please supply an IR object");
   check.verify.object(options.ir.north, "Please supply an IR North object");
   check.verify.object(options.ir.east, "Please supply an IR East object");
   check.verify.object(options.ir.south, "Please supply an IR East object");
   check.verify.object(options.ir.west, "Please supply an IR West object");
   check.verify.object(options.rfid, "Please supply an rfid object");
   */
  this._options = options;

  this._shields = {
    orientation: SHIELDS.EQUAL,
    north: 100,
    east: 100,
    south: 100,
    west: 100
  };

  if(!Array.isArray(this._options.motors.left)) {
    this._options.motors.left = [this._options.motors.left];
  }

  if(!Array.isArray(this._options.motors.right)) {
    this._options.motors.right = [this._options.motors.right];
  }

  this._speed = 0.6;

  if(this._options.type == TYPES.TRACKED) {
    this._speed = 0.4;
  }

  this._config = require("rc")("nodebotwars", path.resolve(__dirname, ".nodebotwarsrc"));

  var id;

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

Client.prototype._applyMotorSpeed = function(value, motor, index) {
  var targetSpeed = value;

  // motors are placed in mirror image positions
  if(index > 0) {
    targetSpeed *= -1;
  }

  targetSpeed *= this._speed;
  targetSpeed = Math.round(targetSpeed);

  if(targetSpeed > 0) {
    console.info("motor forward", value, "this._speed", this._speed, "total", targetSpeed);
    motor.forward(targetSpeed);
  } else if(targetSpeed < 0) {
    console.info("motor reverse", value, "this._speed", this._speed, "total", Math.abs(targetSpeed));
    motor.reverse(Math.abs(targetSpeed));
  } else {
    console.info("motor stop", value);
    motor.stop();
  }
}

Client.prototype.leftMotor = function(value) {
  this._options.motors.left.forEach(this._applyMotorSpeed.bind(this, value));
};

Client.prototype.rightMotor = function(value) {
  this._options.motors.right.forEach(this._applyMotorSpeed.bind(this, value));
};

Client.prototype.shields = function() {
  return this._shields.orientation;
};

Client.prototype.shieldsEqual = function() {
  this._distributeShields(SHIELDS.EQUAL, [0.25, 0.25, 0.25, 0.25]);
};

Client.prototype.shieldsNorth = function() {
  this._distributeShields(SHIELDS.NORTH, [0.6, 0.2, 0, 0.2]);
};

Client.prototype.shieldsEast = function() {
  this._distributeShields(SHIELDS.EAST, [0.2, 0.6, 0.2, 0]);
};

Client.prototype.shieldsSouth = function() {
  this._distributeShields(SHIELDS.SOUTH, [0, 0.2, 0.6, 0.2]);
};

Client.prototype.shieldsWest = function() {
  this._distributeShields(SHIELDS.WEST, [0.2, 0, 0.2, 0.6]);
};

Client.prototype._distributeShields = function(orientation, distribution) {
  this._shields.orientation = orientation;

  var total = this._shields.north + this._shields.east + this._shields.south + this._shields.west;

  this._shields.north = total * distribution[0];
  this._shields.east = total * distribution[1];
  this._shields.south = total * distribution[2];
  this._shields.west = total * distribution[3];
};

module.exports = Client;
