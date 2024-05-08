const axios = require('axios');
const config = require("../config");

const getCloudCluster = async () => {
  try {
    const response = await axios.get(config.smartOrchestratorUrl.concat('/clusters/cloud/find'));
	  return response.data.uid;
  } catch (err) {
    throw new Error(err.message);
  }
}

const getEnablers = async () => {
  try {
    const enablers = await axios.get(
      config.smartOrchestratorUrl.concat("/enabler")
    );
    return enablers.response.data
  } catch (err) {
    throw new Error(err.message);
  }
}

const deployAgent = async (agentData) => {
  try {
    const deployResponse = await axios.post(config.smartOrchestratorUrl.concat('/enabler'), agentData);
    return deployResponse.response.data
  } catch (err) {
    throw new Error(err.message);
  }
}

const deleteAgent = async (agentId) => {
  try {
    const deployResponse = await axios.post(config.smartOrchestratorUrl.concat('/enabler'), agentId);
    return deployResponse.response.data
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  getCloudCluster,
  getEnablers,
  deployAgent,
  deleteAgent
}