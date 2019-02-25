const commonConfig = require('./jest.config.common')

module.exports = Object.assign({}, commonConfig, {
  setupFilesAfterEnv: [`${__dirname}/setup.strict.ts`],
})
