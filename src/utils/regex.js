export function tokenRegex (opts = {}) {
  // selector $1 === negation
  // selector $2 === attribute name
  // selector $3 === operator
  // selector $4 === attribute value

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
