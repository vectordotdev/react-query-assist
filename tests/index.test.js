import React from 'react'
import test from 'ava'
import { mount } from 'enzyme'
import { mockAttributes } from './helpers'
import QueryAssist from '../src'

test.beforeEach(async t => {
  const data = Promise.resolve(mockAttributes)

  t.context.wrapper = mount(
    <QueryAssist
      getData={() => data} />
  )

  // simulate typing in textarea field
  t.context.wrapper.simulateTyping = (value = '', position) => {
    const textarea = t.context.wrapper.find('textarea')
    const newPos = position || value.length

    textarea.simulate('change', { target: { value } })
    textarea.getDOMNode().setSelectionRange(newPos, newPos)
    textarea.simulate('select')
  }

  await data
})

test('closed at start', t => {
  const { wrapper } = t.context
  t.false(wrapper.state('loading'))
  t.deepEqual(wrapper.state('attributes'), mockAttributes)
  t.is(wrapper.state('overlayComponents').length, 2)
  t.false(wrapper.state('dropdownOpen'))
})

test('opens when search is focused', t => {
  const { wrapper } = t.context
  wrapper.simulateTyping()
  t.true(wrapper.state('dropdownOpen'))
})

test('remains open when typing an attribute', t => {
  const { wrapper } = t.context
  wrapper.simulateTyping('lev')
  t.true(wrapper.state('dropdownOpen'))
  t.is(wrapper.state('dropdownValue'), 'lev')
  t.is(wrapper.state('overlayComponents')[0].length, 0)
})

test('opens with new word', t => {
  const { wrapper } = t.context
  wrapper.simulateTyping('level:info ')
  t.true(wrapper.state('dropdownOpen'))
  t.is(wrapper.state('dropdownValue'), '')
  // makes sure dropdown position is correct
  t.is(wrapper.state('overlayComponents')[0].length, 2)
})

test('opens at end of existing token', t => {
  const { wrapper } = t.context
  wrapper.simulateTyping('foobar level:error level:info bazqux', 29)
  t.true(wrapper.state('dropdownOpen'))
  t.is(wrapper.state('dropdownValue'), 'level:info')
  // splits up the overlay correctly
  t.is(wrapper.state('overlayComponents')[0].length, 3)
  t.is(wrapper.state('overlayComponents')[0][0], 'foobar ')
  t.is(typeof wrapper.state('overlayComponents')[0][1], 'object')
})

test('does not open at the end of invalid token', t => {
  const { wrapper } = t.context
  wrapper.simulateTyping('foo:bar')
  t.false(wrapper.state('dropdownOpen'))
  t.is(wrapper.state('dropdownValue'), 'foo:bar')
})

test('opens at end of partial token', t => {
  const { wrapper } = t.context
  wrapper.simulateTyping('level:')
  t.true(wrapper.state('dropdownOpen'))
  t.is(wrapper.state('dropdownValue'), 'level:')
})

test('opens at end of wildcard token', t => {
  const { wrapper } = t.context
  wrapper.simulateTyping('level:in*')
  t.true(wrapper.state('dropdownOpen'))
})

test('opens at end of quoted token', t => {
  const { wrapper } = t.context
  wrapper.simulateTyping('other:"foo bar"')
  t.true(wrapper.state('dropdownOpen'))
  // with wildcard
  wrapper.simulateTyping('other:"foo bar*"')
  t.true(wrapper.state('dropdownOpen'))
})

test('does not reopen for word when manually closed', t => {
  const { wrapper } = t.context
  // opens and closes with esc key
  wrapper.simulateTyping('lev')
  t.true(wrapper.state('dropdownOpen'))
  wrapper.instance().onClose(true)
  t.false(wrapper.state('dropdownOpen'))
  // doesn't reopen for word
  wrapper.simulateTyping('level')
  t.false(wrapper.state('dropdownOpen'))
  // reopens with new word
  wrapper.simulateTyping('level ')
  t.true(wrapper.state('dropdownOpen'))
})

test('closes dropdown when there is no attribute match', t => {
  const { wrapper } = t.context
  wrapper.simulateTyping('foobar baz')
  t.false(wrapper.state('dropdownOpen'))
})

test('highlights valid tokens in the query', t => {
  const { wrapper } = t.context
  wrapper.simulateTyping('foo level:info level:foo bar (foo:bar OR other:"foo bar") other:a* http_response:400 baz http_response:>600')
  const overlay = wrapper.state('overlayComponents')
  t.is(overlay[0][0], 'foo ')
  t.is(overlay[0][1].props.children, 'level:info')
  t.is(overlay[0][2], ' level:foo bar (foo:bar OR ')
  t.is(overlay[0][3].props.children, 'other:"foo bar"')
  t.is(overlay[0][4], ') ')
  t.is(overlay[0][5].props.children, 'other:a*')
  t.is(overlay[0][6], ' ')
  t.is(overlay[0][7].props.children, 'http_response:400')
  t.is(overlay[0][8], ' baz ')
  t.is(overlay[1].props.children[0], 'http_response:>600')
})

test('inserts selected value at end of query', t => {
  const { wrapper } = t.context
  wrapper.simulateTyping('foobar ')
  wrapper.instance().onSelectValue('level:info', ' ')
  t.is(wrapper.state('value'), 'foobar level:info ')
})

test('inserts selected value in middle of query', t => {
  const { wrapper } = t.context
  wrapper.simulateTyping('foobar le other:foo', 9)
  wrapper.instance().onSelectValue('level', ':')
  t.is(wrapper.state('value'), 'foobar level: other:foo')
})

test('alters existing token in query with parens', t => {
  const { wrapper } = t.context
  wrapper.simulateTyping('foobar (level:info other:foo)', 18)
  wrapper.instance().onSelectValue('-level:error')
  t.is(wrapper.state('value'), 'foobar (-level:error other:foo)')
})

// figure out how to test dropdown position,
// jsdom doesn't currently support node.offsetLeft?
test.todo('integration: dropdown location')
