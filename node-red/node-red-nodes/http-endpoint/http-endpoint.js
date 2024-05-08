module.exports = function(RED) {
  function HttpEndpointNode(config) {
      RED.nodes.createNode(this,config);
      var node = this;
      node.on('input', function(msg) {
          msg.payload = node.topic
          node.send(msg);
      });
  }
  RED.nodes.registerType("http-endpoint",HttpEndpointNode);
}