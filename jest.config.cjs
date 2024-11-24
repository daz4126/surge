module.exports = {
  transform: {
    "^.+\\.jsx?$": "babel-jest"
  },
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['js'],
  testMatch: ['**/*.test.js']
};