# React Query Assist

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

## Todo

- [ ] Display tokens as React components inside query input
- [ ] Figure out how to make contentEditable work with react (for above item)
- [ ] Position dropdown where the cursor is when it opens
- [ ] Sort suggestions and highlight closest match
- [ ] Don't wrap values in parens
- [ ] Add placeholder for input
- [ ] Hide dropdown on unfocus and escape
- [ ] Selecting value from dropdown should insert space and reopen dropdown
- [ ] Dropdown should always come up when input is empty
- [ ] Visually distinguish tokens
- [ ] Moving cursor to half-completed term should bring up assist
- [ ] Always close dropdown when it loses focus
- [ ] Wait to show wildcard suggestion until something is typed
- [ ] Only show <, >, <=, >= operators for numeric fields
- [ ] Only show wildcard suggestion for strings
- [ ] Only suggestion quoted when a string

## API Mock

Data that should come back from the API follows this structure:

```
[
  {
    name,
    type,
    enumerations: [] or null
  }
]
```

[build-badge]: https://img.shields.io/travis/timberio/react-query-assist/master.png?style=flat-square
[build]: https://travis-ci.org/timberio/react-query-assist

[npm-badge]: https://img.shields.io/npm/v/react-query-assist.png?style=flat-square
[npm]: https://www.npmjs.org/react-query-assist

[coveralls-badge]: https://img.shields.io/coveralls/timberio/react-query-assist/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/timberio/react-query-assist
