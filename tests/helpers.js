import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { JSDOM } from 'jsdom'

const {
  window
} = new JSDOM('<!doctype html><html><body></body></html>')

global.window = window
global.document = window.document

Enzyme.configure({
  adapter: new Adapter()
})

export const mockAttributes = [
  {
    name: 'level',
    type: 'string',
    enumerations: ['info', 'error']
  },
  {
    name: 'http_response',
    type: 'int',
    enumerations: [200, 400]
  },
  {
    name: 'other',
    type: 'string',
    enumerations: null
  }
]
