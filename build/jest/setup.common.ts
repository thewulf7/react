/**
 * Setup
 * This is the bootstrap code that is run before any tests, utils, mocks.
 */
import * as enzyme from 'enzyme'
// @ts-ignore this import is correct
import Adapter from 'enzyme-adapter-react-16'

enzyme.configure({
  adapter: new Adapter(),
  disableLifecycleMethods: true,
})
