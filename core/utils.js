const { clientDb } = require('./db')
const { clientSmart } = require('./smart')
const config = require('./config')
const { v4: uuidv4 } = require('uuid')

/** 
 * Deploys a sequence. The sequence definition is stored in the LTSE and the corresponding agent is deployed in the K8s cluster using its Helm chart.
 * @param		{Array}		sequence		Sequence
*/
const deploySequence = async (sequence) => {
	const intermediateNodes = Math.trunc(sequence.length / 2);
	console.log('Sequence ' + sequence[0].id + ' Intermediate nodes: '.concat(intermediateNodes));
	if (intermediateNodes < 1) console.log('Discarded sequence');
	for (let i = 1; i <= intermediateNodes; i += 2) {
		let agentType = sequence[i].type;
		console.log('Configuring and deploying '.concat(agentType).concat(' agent type...'));
		const beforeNode = sequence[i - 1];
		const nextNode = sequence[i + 1];
		const node = sequence[i];

		// Obtain dynamically the configurable parameters of the agent and populate using the linked nodes (previous and next).
		const enablerName = 'agent-' + node.type.concat('-').concat(uuidv4().split('-')[0]);
		envVars = {
			in: {},
			out: {},
			node: {}
		}
		let beforeNodeProps = beforeNode.properties
		beforeNodeProps.forEach(i => envVars.in[i] = beforeNode[i])
		let nextNodeProps = nextNode.properties
		nextNodeProps.forEach(i => envVars.out[i] = nextNode[i])
		let nodeProps = node.properties
		nodeProps.forEach(i => envVars.node[i] = node[i])

		let agentData = {
			name: enablerName,
			helmChart: config.helmChartRepository.concat('/agent').concat(agentType.replace('-','')),
			auto: false,
			cluster: config.clusterId,
			version: "",
			timeout: 60,
			values: {
				agent: {
					envVars: envVars
				}
			}
		}
	
		try {
			console.log("Agent deployment configuration:")
			console.log(agentData)
			// const enablerId = uuidv4().split("-")[0]; // debug
			const response = await clientSmart.deployAgent(agentData)
			const enablerId = response.uid;
			const seqId = uuidv4().split('-')[0];
			const finalSeq = {
				id: seqId,
				enablerId: enablerId,
				nodes: sequence,
			};
			// index the deployed sequence in the LTSE
			clientDb.indexSequence(finalSeq)
			console.log('Agent enabler ID: '.concat(enablerId));
		} catch (error) {
			if (error.response) {
				console.log(error.response.status)
				console.error(error.response.data);
				throw new Error(error.response.data.msg);
			} else console.error(error);
		}
	}
}

/** 
 * Deletes a deployed sequence. The sequence definition is deleted from the LTSE and the Helm chart of the corresponding agent is deleted from the K8s cluster.
 * @param		{Array}		sequence		Sequence
*/
const deleteSequence = async (sequence) => {
	console.log('Sequence '.concat(sequence.id).concat(' has been deleted'));
	console.log('Removing the linked agents...');

	try {
		const enablerId = sequence.enablerId;
		// HTTP DELETE request to the smart orchestrator to delete the agent
		await clientSmart.deleteAgent(enablerId)
		await clientDb.deleteSequence(sequence.id)
	} catch (error) {
		console.error(error.response.data);
		throw new Error(error.response.data.msg);
	}
}

/** 
 * Finds the linked previous node (from left to right) of another node.
 * @param		{Array}   flows				Node-RED flows of a tab.
 * @param		{Array}		endNode			Node-RED end node, which has to be found its previous linked node.
 * @param		{Array}   array				In this array will be stored the final sequence, which is an array of Node-RED nodes. It must contain the final node.
*/
const findLinkedNode = (flows, endNode, array) => {
	linkedNode = flows.find((n) => n.wires[0].includes(endNode.id));
	if (linkedNode) {
		let node = JSON.parse(JSON.stringify(linkedNode));
		adaptNode(node);
		array.unshift(node);
		findLinkedNode(flows, linkedNode, array);
	}
}

/** 
 * Searches a sequence in an array of sequences
 * @param		{Array}		seq					Sequence, an array of objects.
 * @param 	{Array}   deployed		Array of sequences, an array of arrays.
 * @return	{Object}							Object with two properties: 1) isPresent (Boolean): 
 * 																if the sequence has been found in the array, 2) index (Number): index of the sequence in the array.
*/
const searchForArray = (deployed, seq) => {
	var i, j, current;
	for (i = 0; i < deployed.length; ++i) {
		if (seq.length === deployed[i].length) {
			current = deployed[i];
			for (j = 0; j < seq.length && JSON.stringify(seq[j]) === JSON.stringify(current[j]); ++j);
			if (j === seq.length) return { isPresent: true, index: i };
		}
	}
	return { isPresent: false, index: -1 };
}

/** 
 * Deletes x, y and wires properties from a Node-RED node object.
 * @param		{Object}		node			Node-RED node object.
*/
const adaptNode = (node) => {
	delete node.x;
	delete node.y;
	// delete node.z; // TODO difference sequences if in different tasks (e.g., the same sequence in different tabs will not be marked as equal, it will be deployed twice)?
	delete node.wires;
}

const getAvailableNodes = async () => {}

module.exports = {
  deploySequence,
  deleteSequence,
  findLinkedNode,
  searchForArray,
  adaptNode,
  getAvailableNodes
}