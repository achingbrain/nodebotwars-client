var Client = require("./lib/Client"),
  path = require("path");

var config = require("rc")("nodebotwars", path.resolve(__dirname, ".nodebotwarsrc"));

var server = new Client(config);
