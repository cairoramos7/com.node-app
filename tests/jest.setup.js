jest.setTimeout(30000);
process.env.JWT_SECRET = 'test-secret';

const fs = require('fs');
const path = require('path');

const uriFile = path.join(__dirname, '../test-mongo-uri.json');
if (fs.existsSync(uriFile)) {
    const { mongoUri } = JSON.parse(fs.readFileSync(uriFile, 'utf8'));
    process.env.MONGO_URI = mongoUri;
    process.env.MONGO_URI_TEST = mongoUri;
}
