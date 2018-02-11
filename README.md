# React Query Assist

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

## Todo

- [ ] Don't reopen dropdown on word if intentionally closed with escape key
- [ ] Open dropdown when at the end of a quoted token
- [ ] Show a few suggestions when there are no enums
- [ ] Enforce an enum if there are any on an attribute
- [ ] Visually show negated values, whether token or not (e.g. -"some value")
- [ ] Only show suggestion for quoted value when attribute is string type
- [ ] Only show wildcard suggestion for string types
- [ ] Editing (replacing) a token in the middle of the query should not add a space
- [ ] Strip out Timber styling and allow custom components/styling
- [ ] Write some tests
- [ ] Write out some basic documentation on how to use
- [ ] Publish to NPM

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
