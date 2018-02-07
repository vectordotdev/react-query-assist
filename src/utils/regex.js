export function tokenRegex (partial) {
  return new RegExp(
    `-?` + // dont include negation in selector but allow it
    `([\\w.]+)` + // the attribute name
    `:${partial ? '?' : ''}` + // assume it's a token when there's no colon
    `(".+?"|[^\\s():]+)` + // the attribute value
    `${partial ? '?' : ''}`, // whether attribute value can be empty
    'g'
  )
}
