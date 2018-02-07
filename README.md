# React Query Assist

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

## Todo

- [ ] Sort suggestions and highlight closest match
- [ ] Selecting value from dropdown should insert space and reopen dropdown
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
