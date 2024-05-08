const axios = require('axios');
const config = require('../config');
const { clientDb } = require('../db')
const { deploySequence, deleteSequence, adaptNode, findLinkedNode, searchForArray } = require('../utils')

/** 
 * For each tab of the Node-RED UI, obtains the flows, filters the flows with valid Node-RED nodes, 
 * obtains the end nodes of all the Node-RED flows, and finally stores all the sequences in an array (sequences).
 * Then, retrieves the stores sequences from the LTSE (Elasticsearch) to compare the current with the previous status.
 * Finally, deletes the deployed sequences and deploys the created sequences by the user.
 * @return		{Object}		Result of the execution.
*/
const execute = async (req, res) => {
  const noderedUrl = config.noderedUrl;
  const validNodes = config.validNodes.split(',');
	console.log('\n==================================================');
	try {
		const response = await axios.get(noderedUrl.concat('/flows'));
		const tabs = response.data.filter((i) => i.type === 'tab');
		let sequences = [];
		for (tab of tabs) {
			console.log('Node-RED flows deployed on tab ' + tab.id);
			let flows = await axios.get(noderedUrl.concat('/flow/'.concat(tab.id)));
			flows = flows.data.nodes.filter((n) => validNodes.includes(n.type));
			// obtain the last nodes of the tab's sequences
			lastNodes = flows.filter((n) => n.wires[0].length == 0);
			// build the sequence for each end node
			lastNodes.forEach((i) => {
				let node = JSON.parse(JSON.stringify(i));
				adaptNode(node);

				let sequence = [node];
				sequences.push(sequence);
				findLinkedNode(flows, i, sequence);
			});
		}

		// TODO check sequence validity (at this moment only is checked if all nodes are valid, but not the validity of a sequence itself)

		// obtain deployed sequences from LTSE
		let result = await clientDb.getDeployedSequences(true)
		let storedDeployedSequences = result.hits.hits.map((i) => i._source);

		// Check present sequences, if is stored in db as deployed, delete from array.
		for await (sequence of storedDeployedSequences) {
			const searchResult = searchForArray(sequences, sequence.nodes);
			if (searchResult.isPresent) {
				// delete sequence from array
				console.log('This sequence has already been deployed');
				sequences.splice(searchResult.index, 1);
			} else {
				// delete sequence because it has been deleted from the Node-RED UI
				await deleteSequence(sequence);
			}
		}

		// deploy remaining sequences
		for (s of sequences) {
			await deploySequence(s);
		}

		return res.status(200).send({ message: 'Deploying sequences...' });
	} catch (error) {
		console.error(error);
		// TODO improve error logs: by sequence, and store the responses of the smart orchestrator
		return res.status(500).send({ message: 'Error deploying sequences...' });
	}
}

module.exports = {
  execute
}