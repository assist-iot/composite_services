const { Client } = require('@elastic/elasticsearch');
const { Transport } = require('@elastic/transport');
const config = require('../config')
let client

const connectDb = async () => {
  try {
    // LTSE noSQL client connection
    let baseUrl = config.ltseUrl;
    let path = '/nosql/api';

    // then create a class, that extends Transport class to modify the path
    class MTransport extends Transport {
      request(params, options, callback) {
        params.path = path + params.path; // <- append the path right here
        return super.request(params, options, callback);
      }
    }
    // and finally put the extended class on the options.
    client = new Client({
      node: baseUrl,
      Transport: MTransport,
    });
  } catch (err) {
      throw new Error(err.message)
  }
}

const getDbClient = async () => {
  return client
}

module.exports = {
  connectDb,
  getDbClient
}