import { compare, compareFuzzy } from "../compare";

export interface ITokenRegexOptions {
  partial?: boolean;
}

export interface IToken {
  prepended: string;
  attributeName: string;
  attributeValue: string;
  operator: string;
}

export function tokenRegex(opts: ITokenRegexOptions = {}) {
  const qtfr = opts.partial ? "*" : "+";

  return new RegExp(
    `(?!^|\\(|\\s)*` + // find beginning of token
    `([-]+)?` + // capture prepended negation character
    `([\\w.$]+)` + // the attribute name
    `${opts.partial ? "?" : ""}` + // assume it's a token, even with no attribute
    `:${opts.partial ? "?" : ""}` + // assume it's a token, even with no colon
    `(?!:)` + // make sure colon isn't repeated
    `([><=]*)` + // the operators
    `(?:(")(.${qtfr}?)(\\*)?"|([^\\s()*"]${qtfr}))` + // the attribute value, checking for quotes
    `${opts.partial ? "?" : ""}` + // whether attribute value can be empty
    `(\\*)?` + // capture appended wildcard
    `(?!\\s|\\)|$)*`, // find the end of the token
    "g",
  );
}

export function parseToken(value: string, attributes: IQueryAssistData = [], nameKeyIncludes = []) {
  const results = Array.isArray(value)
    ? value
    : tokenRegex({ partial: true }).exec(value);

  if (!results || !results.length) {
    return {};
  }

  const tokenData = {
    fullToken: results[0],
    attributeName: results[2],
    attributeNameValid: false,
    attributeValue: results[5] || results[7],
    attributeValueValid: false,
    prepended: results[1] || "",
    operator: results[3],
    negated: results[0].indexOf("-") > -1,
    quoted: Boolean(results[4]),
    wildcard: Boolean(results[6] || results[8]),
  };

  if (attributes) {
    const attribute = attributes
      .find((attr) => {
        let matchFound = false;
        for (const key of nameKeyIncludes) {
          if (compare(attr[key], tokenData.attributeName)) {
            matchFound = true;
            break;
          }
        }
        return matchFound;
      });

    if (attribute) {
      tokenData.attributeNameValid = true;
      tokenData.attributeValueValid = true;

      if (Array.isArray(attribute.enumerations)) {
        tokenData.attributeValueValid = attribute.enumerations
          .findIndex((v) => compareFuzzy(tokenData.attributeValue, v)) > -1;
      }
    }
  }

  return tokenData;
}

export function serializeToken(token: IToken) {
  const {
    prepended = "",
    attributeName = "",
    attributeValue = "",
    operator = "",
  } = token || {};

  return `${prepended}${attributeName}:${operator}${attributeValue}`;
}

export function extractTokens(value, attributes, nameKeyIncludes) {
  const positions = [];
  const regex = tokenRegex();

  let result;
  while ((result = regex.exec(value)) !== null) {
    if (attributes) {
      const parsed = parseToken(result, attributes, nameKeyIncludes);

      if (!parsed.attributeNameValid || !parsed.attributeValueValid) {
        continue;
      }
    }

    positions.push([
      result.index, // start position
      regex.lastIndex, // end position
    ]);
  }

  return positions;
}
