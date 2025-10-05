module.exports = {
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/"],
  testMatch: [
    "**/tests/unit/**/*.test.js",
    "**/tests/integration/**/*.test.js"
  ],
  moduleNameMapper: {
    "^@src/app$": "<rootDir>/app.js",
    "^@src/(.*)$": "<rootDir>/src/$1",
  },
  moduleDirectories: ["node_modules", "<rootDir>"],
  setupFiles: ["dotenv/config"], // Load dotenv before tests run
};
