export function tokenRegex (opts = {}) {
  return new RegExp(
    `-?` + // dont include negation in selector but allow it
    `([\\w.]+)` + // the attribute name
    `:${opts.partial ? '?' : ''}` + // assume it's a token when there's no colon
    `(".+?"|[^\\s():]+)` + // the attribute value
    `${opts.noAttr || opts.partial ? '?' : ''}`, // whether attribute value can be empty
    'g'
  )
}
