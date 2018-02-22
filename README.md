# React Query Assist

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]

A smart search bar for React that comes with built-in autocomplete and token visualization.

![demo animation][demo]

<a name="token"></a>
#### What is a token?

A token is a key-value in a search query that contains an attribute and a value separated by a colon. e.g. `some_attribute:some_enumeration`

## Getting Started

```bash
$ npm install -S react-query-assist
```

```javascript
import QueryAssist from 'react-query-assist'

async function getData () {
  return [
    {
      name: 'some_attribute',
      type: 'string',
      enumerations: ['enum1', 'enum2', 'enum3' /* ... */ ]
    }
  ]
}

export default function () {
  return (
    <QueryAssist
      getData={getData}
      onSubmit={console.log} />
  )
}
```

<a name="autocomplete"></a>
## Autocomplete Data

The [getData prop](#getData) should resolve with the full list of autocomplete values. This only gets called once when the assist is mounted. The data structure should be an array of attributes, and each attribute should have a name, type and enumerations for possible values:

```
[
  {
    name: String,
    type: String,
    enumerations: Array or null
  }
]
```

- `name` The value of the attribute in the [token](#token)
- `type` The data type of the enumerations (this determines available operators)
- `enumerations` A list of available attribute values in the [token](#token)

#### Wildcards and quoted values

If the attribute type is a string, there are two additional autocomplete values that may be suggested:

- An appended wildcard will be suggested if the value is not blank
- Wrapping the value in quotes will be suggested if there are no enumerations for the attribute

#### When will the dropdown open?

The autocomplete dropdown will automatically open when it detects a new word is being typed, or if the caret is positioned at the end of a valid token. (Tokens are only valid if the attribute and value match an attribute and enumeration in the autocomplete data.)

When a token is clicked, it will bring the caret to the end of the token and open the dropdown for easy editing.

## Operators

Each token in the query can have a number of operators, depending on the data type of the enumerations. They will change based on the `type` of the active attribute. The operator buttons in the dropdown will automatically update as you type, but they can also be clicked to toggle/update the value.

#### Available to all tokens

- `NEGATE` `-`

#### Available to `int` or `float` tokens

- `GT` `>`
- `LT` `<`
- `GTE` `>=`
- `LTE` `<=`

<a name="themes"></a>
## Themes

The default styling is intentionally neutral so you can customize the look based on your own style guide. You can add custom styling to both the input field and the dropdown by using the [inputTheme](#inputTheme) and [dropdownTheme](#dropdownTheme) props. These objects will be passed as styles to the components, so you can use any style attribute along with a few extras:

- For inputTheme, you can set `tokenColor` to determine the highlight color of the tokens, and `placeholderColor` to determine the color of the placeholder text.
- For dropdownTheme, you can set `backgroundActive`, `borderActive` and `colorActive` to determine the style of the currently highlighted autocomplete value.

## Keyboard

By default, [keyboard helpers](#keyboardHelpers) for the dropdown are enabled. Meaning when the dropdown is open, pressing the following keys will result in action:

- `up`/`down` Will navigate through the autocomplete values
- `enter` Will select the currently highlighted value and insert into the query
- `escape` Will close the dropdown

## Props

| Prop Name  | Prop Type | Description | Default Value |
| -----------| --------- | ----------- | ------------- |
| <a name="getData"></a>`getData` | function | Should return a promise that resolves with the [autocomplete data](#autocomplete). Only gets called once when the assist is mounted in the DOM. | - |
| `onSubmit` | function | Called with the final value of the query when the enter key is pressed. *Pressing enter will submit the query, but shift+enter will create a new line.* | - |
| `defaultValue` | string | The default value to pass to the input component. Will parse this value when mounted for any existing tokens. | - |
| `placeholder` | string | The placeholder text to use for the input field. | `Search` |
| <a name="keyboardHelpers"></a>`keyboardHelpers` | boolean | Whether to enable the keyboard helpers for the dropdown. | `true` |
| <a name="inputTheme"></a>`inputTheme` | object | The styles to use for the input component. See the [themes](#themes) section. | - |
| <a name="dropdownTheme"></a>`dropdownTheme` | object | The styles to use for the dropdown component. See the [themes](#themes) section. | - |
| `footerComponent` | function | Optionally append a footer component to the dropdown. Useful for adding a link to search documentation, etc. | - |
| `debug` | boolean | Enables styling useful for debugging. | `false` |

[build-badge]: https://img.shields.io/travis/timberio/react-query-assist/master.png?style=flat-square
[build]: https://travis-ci.org/timberio/react-query-assist

[npm-badge]: https://img.shields.io/npm/v/react-query-assist.png?style=flat-square
[npm]: https://www.npmjs.org/react-query-assist

[demo]: demo.gif
