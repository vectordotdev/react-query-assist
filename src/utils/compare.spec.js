import test from 'ava'
import * as compare from './compare'

test('unit: compare', t => {
  t.true(compare.compare())
  t.true(compare.compare('foobar', 'foobar'))
  t.true(compare.compare('foobar', 'FOOBAR'))
  t.false(compare.compare('foo', 'FOOBAR'))
})

test('unit: compareFuzzy', t => {
  t.true(compare.compareFuzzy())
  t.true(compare.compareFuzzy('oob', 'Foobar'))
  t.true(compare.compareFuzzy('foo', 'Foobar'))
  t.true(compare.compareFuzzy('foobar', 'Foobar'))
  t.false(compare.compareFuzzy('boo', 'Foobar'))
})
