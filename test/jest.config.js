const { resolve } = require("path")
const { rootDir } = require("../jest.config")
const root = resolve(__dirname, '..')
const rootConfig = require(`${root}/jest.config.js`)

module.exports = {...rootConfig, ...{
  rootDir: root,
  preset: '@shelf/jest-mongodb',
  displayName: "end2end-functional-tests",
  testMatch: ["<rootDir>/test/**/*.test.ts"],
//  setupFilesAfterEnv: ["<rootDir>/test/jest-setup.ts"]
//   Uma lista de caminhos para módulos que executam algum
//   código para configurar ou configurar a estrutura de 
//   teste antes que cada arquivo de teste no conjunto seja
//   executado. Como setupFiles é executado antes que a 
//   estrutura de teste seja instalada no ambiente, esse 
//   arquivo de script apresenta a oportunidade de executar 
//   algum código imediatamente após a instalação da 
//   estrutura de teste no ambiente, mas antes do próprio 
//   código de teste.
 }}
