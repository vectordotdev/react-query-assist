export function tokenRegex (opts = {}) {
  return new RegExp(
    `(-)?` + // watch for possible negation
    `([\\w.]+)` + // the attribute name
    `:${opts.partial ? '?' : ''}` + // assume it's a token, even with no colon
    `([><=]*)` + // the operators
    `(".*?"|[^\\s():]*)` + // the attribute value
    `${opts.noAttr || opts.partial ? '?' : ''}`, // whether attribute value can be empty
    'g'
  )
}

export function parseToken (value, opts = {}) {
  const results = tokenRegex(opts).exec(value)

  if (results) {
    return {
      fullToken: results[0],
      negation: Boolean(results[1]),
      attributeName: results[2],
      operator: results[3],
      attributeValue: results[4]
    }
  }
}
