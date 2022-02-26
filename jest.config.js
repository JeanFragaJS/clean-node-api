const { resolve } = require('path')

const root = resolve(__dirname)

module.exports = {
  rootDir: root,
  displayName:'root-tests',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'node',
  clearMocks: true,
  preset: 'ts-jest',
  collectCovereFrom: [
    '<rootDir>/src/$1',
    '<rootDir>/test/$1'
  ],
  coveregeDirectory: 'coverege',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@test/(.*)': '<rootDir>/test/$1'
  }

}