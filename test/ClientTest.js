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
    it("should connect to the game server and emit the connected event", function(done) {
      var rpcPort = 10;
      var id = "an_id";

      var remote = {
        connect: sinon.stub()
      };

      // make dnode's connect call it's callback after a little while
      stubs.dnode.connect.callsArgWithAsync(1, remote);

      // after connecting, we call connect on the server to get our ID
      remote.connect.callsArgWithAsync(1, null, id);

      var client = new Client({
        rpc: {
          port: rpcPort
        }
      });
      client.on("connected", function() {
        // should have called connect
        stubs.dnode.connect.callCount.should.equal(1);

        // should have connected to the right port
        stubs.dnode.connect.getCall(0).args[0].should.equal(rpcPort);

        // should have stored the assigned id
        client._id.should.equal(id);

        done();
      });
    });
  })
})
