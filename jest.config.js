/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: [
    "<rootDir>"
  ],
  moduleDirectories: [
    "node_modules",
    "<rootDir>"
  ],
};