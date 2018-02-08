export function tokenRegex (opts = {}) {
  return new RegExp(
    `([\\(|-]+)?` + // capture prepended character, negation or paren
    `([\\w.]+)` + // the attribute name
    `${opts.partial ? '?' : ''}` + // assume it's a token, even with no attribute
    `:${opts.partial ? '?' : ''}` + // assume it's a token, even with no colon
    `([><=]*)` + // the operators
    `(".*?"|[^\\s():]*)` + // the attribute value
    `${opts.noAttr || opts.partial ? '?' : ''}`, // whether attribute value can be empty
    'g'
  )
}

export function parseToken (value, opts = {}) {
  const results = tokenRegex(opts).exec(value)

  return results ? {
    fullToken: results[0],
    attributeName: results[2],
    attributeValue: results[4],
    prepended: results[1] || '',
    operator: results[3],
    negated: results[0].indexOf('-') > -1
  } : {}
}
