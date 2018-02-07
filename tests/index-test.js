import React from 'react'
import expect from 'expect'
import { render, unmountComponentAtNode } from 'react-dom'
import Component from '../src'

describe('initial', () => {
  it('runs initial test', () => {
    expect(1 + 1).toEqual(2)
  })
})

describe.skip('Component', () => {
  let node

  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('displays a welcome message', () => {
    render(<Component />, node, () => {
      expect(node.innerHTML).toContain('Welcome to React components')
    })
  })

  it('correctly parses tokens', () => {
    // const testQuery = `keyword1 (level:error || level:debug)(foo OR bar) foo:"foo bar"
    //   ( foo: ) -foo:bar foo:bar* foo:*bar bar:"foo*" http_repsonse.code:>100 keyword3
    //   (foo:" " foo:"" foo:bar:baz)`
    //
    // expect(testQuery.match(TOKEN_REGEX)).toEqual([
    //   'level:error', 'level:debug', 'foo:"foo bar"', '-foo:bar',
    //   'foo:bar*', 'foo:*bar', 'bar:"foo*"', 'http_repsonse.code:>100',
    //   'foo:" "', 'foo:""', 'foo:bar'])
  })
})
