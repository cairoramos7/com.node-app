const fs = require('fs');
const path = require('path');

module.exports = async () => {
  if (global.__MONGOINSTANCE) {
    await global.__MONGOINSTANCE.stop();
  }

  const uriFile = path.join(__dirname, 'test-mongo-uri.json');
  if (fs.existsSync(uriFile)) {
    fs.unlinkSync(uriFile);
  }
};
