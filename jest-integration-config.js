const { resolve } =  require('path')

const root = resolve(__dirname, '.' )
const jestGlobalConfig = require(`${root}/jest.config.js`)

module.exports = { 
  ...jestGlobalConfig, 
  ...{
    displayName: "functional-tests",
    testMatch: ['<rootDir>/src/**/*.test.ts'],
  }
}