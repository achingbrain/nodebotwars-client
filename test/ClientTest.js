var chai = require('chai'),
  expect = chai.expect,
  should = chai.should(),
  sinon = require("sinon"),
  proxyquire = require("proxyquire");

var stubs = {
  dnode: {
    connect: sinon.stub()
  }
};

var Client = proxyquire("../lib/Client", stubs);

describe("Client", function() {
  describe("connect", function() {
    it("should connect to the game server", function(done) {
      var rpcPort = 10;
      var id = "an_id";

      var remote = {
        connect: sinon.stub()
      };

      remote.connect.callsArgWith(1, null, id);

      stubs.dnode.connect.callsArgWith(1, remote);

      var client = new Client({
        rpc: {
          port: rpcPort
        }
      });

      // should have called connect
      stubs.dnode.connect.callCount.should.equal(1);

      // should have connected to the right port
      stubs.dnode.connect.getCall(0).args[0].should.equal(rpcPort);

      // should have stored the assigned id
      client._id.should.equal(id);

      done();
    });
  })
})
