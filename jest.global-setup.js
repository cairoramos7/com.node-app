const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

module.exports = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Store the instance in global to stop it in teardown
  global.__MONGOINSTANCE = mongoServer;

  // Write the URI to a file so test suites can read it
  fs.writeFileSync(path.join(__dirname, 'test-mongo-uri.json'), JSON.stringify({ mongoUri }));

  // Also set env for local debugging if needed
  process.env.MONGO_URI_TEST = mongoUri;
};
