module.exports = function(RED) {
    function EdbeNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.topic = config.topic
        node.on('input', function(msg) {
            msg.payload = node.topic
            node.send(msg);
        });
    }
    RED.nodes.registerType("edbe",EdbeNode);
}