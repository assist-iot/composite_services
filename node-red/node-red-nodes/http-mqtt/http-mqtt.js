module.exports = function(RED) {
    function MqttHttpNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.translation = config.translation
        node.on('input', function(msg) {
            msg.payload = node.translation
            node.send(msg);
        });
    }
    RED.nodes.registerType("http-mqtt",MqttHttpNode);
}