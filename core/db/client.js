const config = require("../config");
const { getDbClient } = require("./conn");

const flowsIndexExists = async () => {
  try {
    const client = await getDbClient();
    return await client.indices.exists({
      index: config.ltseIndex,
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

const createFlowsIndex = async () => {
  try {
    console.log(config.ltseIndex)
    const client = await getDbClient();
    await client.indices.create({
      index: config.ltseIndex,
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

const getClusterHealth = async () => {
  try {
    const client = await getDbClient();
    return await client.cluster.health()
  } catch (err) {
    throw new Error(err.message);
  }
};

const getDeployedSequences = async (includeSequences) => {
  try {
    querySize = (includeSequences) ? 1000 : 0
    const client = await getDbClient();
    return await client.search({
      index: config.ltseIndex,
      size: querySize,
      query: {
        match_all: {},
      },
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

const indexSequence = async (sequence) => {
  try {
    const client = await getDbClient();
    return await client.index({
      index: config.ltseIndex,
      document: sequence,
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteSequence = async (sequenceId) => {
  try {
    const client = await getDbClient();
    return await client.deleteByQuery({
			index: config.ltseIndex,
			refresh: true,
			query: {
				match_phrase: {
					id: sequence.id,
				},
			},
		});
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  flowsIndexExists,
  createFlowsIndex,
  getClusterHealth,
  getDeployedSequences,
  indexSequence,
  deleteSequence
}