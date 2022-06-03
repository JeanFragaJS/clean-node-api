const { resolve } = require('path')

const root = resolve(__dirname, '.')



module.exports = {
  rootDir: root,
  testEnvironment: 'node',
  clearMocks: true,
  preset: '@shelf/jest-mongodb',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/domain/**',
    '!<rootDir>/src/**/*-protocols.ts',
    '!**/protocols/**',
    '!**/util/**',
    '!**/__test__/**',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/*error.ts'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  }
}