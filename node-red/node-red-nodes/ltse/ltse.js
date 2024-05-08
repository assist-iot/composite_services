module.exports = function(RED) {
    function LtseNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.on('input', function(msg) {
            msg.payload = node.storageType
            node.send(msg);
        });
    }
    RED.nodes.registerType("ltse",LtseNode);
}