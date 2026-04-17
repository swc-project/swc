'use strict';

const babelConfig = require('./babel.config.js');

module.exports = {
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/packages/react-native-web/src/vendor/'
  ],
  fakeTimers: {
    enableGlobally: true
  },
  modulePathIgnorePatterns: [
    '<rootDir>/packages/benchmarks/',
    '<rootDir>/packages/react-native-web-docs/',
    '<rootDir>/packages/react-native-web-examples/',
    '<rootDir>/packages/react-native-web/dist/'
  ],
  rootDir: process.cwd(),
  roots: ['<rootDir>/packages'],
  snapshotFormat: {
    printBasicPrototype: false
  },
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/?(*-)+(spec|test).node.[jt]s?(x)'],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', babelConfig()]
  }
};
