const { resolve } = require('path')

const root = resolve(__dirname)

module.exports = {
  rootDir: root,
  displayName: 'unit-test',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '<rootDir>/test/*.ts',
    '!<rootDir>/src/main/**'
  ],
  coverageDirectory: 'coverage',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@test/(.*)': '<rootDir>/test/$1'
  }

}