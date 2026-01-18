jest.setTimeout(30000);
process.env.JWT_SECRET = 'test-secret';

const fs = require('fs');
const path = require('path');

const uriFile = path.join(__dirname, '../test-mongo-uri.json');
if (fs.existsSync(uriFile)) {
    const { mongoUri } = JSON.parse(fs.readFileSync(uriFile, 'utf8'));
    // Ensure unique database per test worker by checking if it ends with /
    const separator = mongoUri.endsWith('/') ? '' : '/';
    // Use JEST_WORKER_ID to ensure uniqueness across parallel runs
    const dbName = `test-db-${process.env.JEST_WORKER_ID || '1'}-${Date.now()}`;
    process.env.MONGO_URI = `${mongoUri}${separator}${dbName}`;
    process.env.MONGO_URI_TEST = process.env.MONGO_URI;
}
