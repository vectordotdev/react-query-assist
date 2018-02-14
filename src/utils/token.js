import { compareSoft, compareHard } from './compare'

export function tokenRegex (opts = {}) {
  return new RegExp(
    `([\\(|-]+)?` + // capture prepended character, negation or paren
    `([\\w.]+)` + // the attribute name
    `${opts.partial ? '?' : ''}` + // assume it's a token, even with no attribute
    `:${opts.partial ? '?' : ''}` + // assume it's a token, even with no colon
    `([><=]*)` + // the operators
    `(?:(")(.*?)"|([^\\s()*:]*))` + // the attribute value, checking for quotes
    `${opts.noAttr || opts.partial ? '?' : ''}` + // whether attribute value can be empty
    `(\\*)?`, // capture appended wildcard
    'g'
  )
}

export function parseToken (value, opts = {}) {
  const results = Array.isArray(value)
    ? value
    : tokenRegex(opts).exec(value)

  if (!results || !results.length) {
    return {}
  }

  const tokenData = {
    fullToken: results[0],
    attributeName: results[2],
    attributeValue: results[5] || results[6],
    prepended: results[1] || '',
    operator: results[3],
    negated: results[0].indexOf('-') > -1,
    quoted: Boolean(results[4]),
    wildcard: Boolean(results[7])
  }

  const attributes = opts.attributes || []
  const attribute = attributes
    .find(({ name }) => compareHard(name, tokenData.attributeName))

  if (attribute) {
    const hasEnums = attribute.enumerations &&
      attribute.enumerations.length

    tokenData.attributeNameValid = true
    tokenData.attributeValueValid = hasEnums
      // do a soft check since we don't care about type
      ? attribute.enumerations
        .findIndex(v => compareSoft(tokenData.attributeValue, v)) > -1
      // no enumerations, so any value is valid
      : true
  }

  return tokenData
}

export function serializeToken (token) {
  const {
    prepended = '',
    attributeName = '',
    attributeValue = '',
    operator = ''
  } = token

  return `${prepended}${attributeName}:${operator}${attributeValue}`
}
