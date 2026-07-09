module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  setupFiles: ["<rootDir>/jest.setup.cjs"],
};
