module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    testMatch: ['**/tests/**/*.test.ts'],
    moduleNameMapper: {
        '^@src/app$': '<rootDir>/src/app.ts',
        '^@src/(.*)$': '<rootDir>/src/$1',
    },
    moduleDirectories: ['node_modules', '<rootDir>'],
    setupFiles: ['dotenv/config'],
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
    globalSetup: '<rootDir>/jest.global-setup.js',
    globalTeardown: '<rootDir>/jest.global-teardown.js',
};
