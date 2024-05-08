const config = require('../config');
const { clientDb } = require('../db')
const { clientSmart } = require('../smart')

const version = async (req, res) => {
	res.status(200).send({ 
		enabler: 'Composite services manager',
		version: process.env.npm_package_version 
	});
}

const health = async (req, res) => {
	// Check smart orchestrator, LTSE and node-red
	try {
		// TODO change to smart health endpoint
		await clientDb.getClusterHealth()
		await clientSmart.getEnablers()
		await axios.get(config.noderedUrl.concat('/diagnostics'));
		return res.status(200).send();
	} catch (e) {
		return res.status(500).send();
	}
}

const metrics = async (req, res) => {
	// obtain deployedSequences from LTSE
	let result = await clientDb.getDeployedSequences(false)
	const response = clientSmart.getEnablers()
	let agents = response.data.filter((i) => i.name.includes('agent-'));
	const metrics = {
		flows: result.hits.total.value,
		deployedAgents: agents.length,
	};
	res.status(200).send(metrics);
}

const openApi = async (req, res) => {
	const openApiSchema = require('../doc/openapi.json')
	res.status(200).send(openApiSchema);
}

module.exports = {
  version,
  health,
  metrics,
  openApi
}