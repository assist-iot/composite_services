const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const routes = require('./routes')

const config = require('./config');
const { connection, clientDb } = require('./db')
const { clientSmart } = require('./smart')

async function init() {
	try {
		console.log('Connecting to the LTSE...')
		await connection.connectDb()
		const indexExists = await clientDb.flowsIndexExists()
		// create index in elastic if no exist
		if (!indexExists) {
			console.log('Index '.concat(config.ltseIndex).concat(' not present in LTSE. Creating index...'));
			await clientDb.createFlowsIndex()
		}
		// TODO if exists, check if flows exist in Node-RED and if not, create?
		config.clusterId = await clientSmart.getCloudCluster();
	} catch (error) {
		console.error('Not possible to connect to the LTSE, please check the configuration!')
		console.error(error.response?.data);
		process.exit(-1)
	}
}

init();

app.use(routes);

app.listen(config.port, () => {
	console.log('Express server listening on port ' + config.port);
});
