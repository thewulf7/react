/**
 * Setup
 * This is the bootstrap code that is run before any tests, utils, mocks.
 */
const enzyme = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')

enzyme.configure({
  adapter: new Adapter(),
  disableLifecycleMethods: true,
})
