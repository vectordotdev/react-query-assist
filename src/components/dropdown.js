import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { parseToken, serializeToken } from '../utils/token'

import {
  Container,
  Section,
  Suggestions,
  Suggestion,
  Helper,
  Operator,
  Key,
  KeyOutline,
  Link
} from './dropdown.styl'

export default class extends PureComponent {
  static propTypes = { // eslint-disable-line
    value: PropTypes.string,
    attributes: PropTypes.array,
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number
  }

  constructor (props) {
    super(props)
    this.keydown = this.keydown.bind(this)
    this.handleEnterKey = this.handleEnterKey.bind(this)
    this.handleEscKey = this.handleEscKey.bind(this)
    this.handleArrowKeys = this.handleArrowKeys.bind(this)
    this.getAttribute = this.getAttribute.bind(this)
    this.getSuggestions = this.getSuggestions.bind(this)
    this.filterSuggestions = this.filterSuggestions.bind(this)
    this.acceptSuggestion = this.acceptSuggestion.bind(this)
    this.getOperators = this.getOperators.bind(this)
    this.setOperator = this.setOperator.bind(this)
    this.state = {
      suggestions: [],
      highlightedIdx: 0,
      selectedIdx: null,
      prepended: '',
      operator: '',
      negated: false
    }
  }

  componentDidMount () {
    document.addEventListener('keydown', this.keydown, false)
    this.filterSuggestions(this.props.value)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.keydown, false)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.value !== nextProps.value) {
      this.filterSuggestions(nextProps.value)
    }
  }

  componentDidUpdate () {
    if (this.state.suggestions.length === 0) {
      this.props.onClose()
    }
  }

  keydown (evt) {
    switch (evt.keyCode) {
      case 9: // tab key
      case 13: // enter key
        this.handleEnterKey(evt)
        break
      case 27: // esc key
        this.handleEscKey(evt)
        break
      case 38: // up key
      case 40: // down key
        this.handleArrowKeys(evt, evt.keyCode)
        break
    }
  }

  handleEnterKey (evt) {
    evt.preventDefault()
    this.acceptSuggestion()
  }

  handleEscKey (evt) {
    evt.preventDefault()
    this.props.onClose()
  }

  handleArrowKeys (evt, keyCode) {
    evt.preventDefault()

    const { highlightedIdx } = this.state
    const isDownKey = keyCode === 40

    // the furthest down it can go before wrapping
    const max = this.state.suggestions.length - 1

    // determine the next position
    const newIdx = highlightedIdx !== null
      ? isDownKey ? highlightedIdx + 1 : highlightedIdx - 1
      : isDownKey ? 0 : max

    this.setState({
      // make sure it doesn't go out of bounds by resetting to opposite side
      highlightedIdx: isDownKey
        ? newIdx <= max ? newIdx : 0
        : newIdx >= 0 ? newIdx : max
    })
  }

  getAttribute (selectedIdx) {
    if (selectedIdx !== null && selectedIdx > -1) {
      return this.props.attributes[selectedIdx]
    }
  }

  getSuggestions (selectedIdx) {
    const selectedAttr = this.getAttribute(selectedIdx)

    return selectedAttr
      ? selectedAttr.enumerations || []
      : this.props.attributes.map(({ name }) => name)
  }

  filterSuggestions (value) {
    const {
      attributeName,
      attributeValue,
      prepended,
      operator,
      negated
    } = parseToken(value, { partial: true })

    const hasAttributeName = attributeName && value.indexOf(':') > -1
    const selectedIdx = hasAttributeName ? this.props.attributes
      .findIndex(({ name }) => name === attributeName) : -1

    const suggestions = this.getSuggestions(selectedIdx)
    const searchValue = selectedIdx > -1 ? attributeValue : attributeName

    const filtered = suggestions.filter(v =>
      new RegExp(escape(searchValue || ''), 'i').test(v))

    this.setState({
      prepended,
      operator,
      negated,
      selectedIdx,
      suggestions: filtered,
      highlightedIdx: 0
    })
  }

  acceptSuggestion () {
    const {
      suggestions,
      highlightedIdx,
      selectedIdx,
      prepended,
      operator
    } = this.state

    const attribute = this.getAttribute(selectedIdx)
    const suggestion = suggestions[highlightedIdx]

    const newValue = attribute
      ? `${attribute.name}:${operator}${suggestion}`
      : suggestion

    const appended = selectedIdx > -1 ? ' ' : ':'
    this.props.onSelect(`${prepended}${newValue}${appended}`)
  }

  getOperators () {
    const attribute = this.getAttribute(this.state.selectedIdx)
    const operators = [
      { name: 'NEGATE', char: '-', active: this.state.negated }
    ]

    if (attribute) {
      switch (attribute.type) {
        case 'int':
        case 'float':
          operators.push({ name: 'GT', char: '>', active: this.state.operator === '>' })
          operators.push({ name: 'LT', char: '<', active: this.state.operator === '<' })
          operators.push({ name: 'GTE', char: '>=', active: this.state.operator === '>=' })
          operators.push({ name: 'LTE', char: '<=', active: this.state.operator === '<=' })
          break
      }
    }

    return operators
  }

  setOperator (newOperator) {
    const { value } = this.props
    const {
      negated,
      operator
    } = this.state

    if (newOperator === '-') {
      const newValue = value
        .replace(/^-?(.*)/, `${negated ? '' : '-'}$1`)

      this.props.onSelect(newValue)
    } else {
      const token = parseToken(value, { partial: true })
      token.operator = operator === newOperator ? '' : newOperator

      this.props.onSelect(serializeToken(token))
    }
  }

  render () {
    const style = {
      left: `${this.props.offsetX || 0}px`,
      top: `${this.props.offsetY || 0}px`
    }

    return (
      <Container
        style={style}>
        <Suggestions>
          {this.state.suggestions.map((suggestion, key) =>
            <Suggestion
              key={key}
              active={this.state.highlightedIdx === key}
              onClick={this.acceptSuggestion}
              onMouseOver={() => this.setState({ highlightedIdx: key })}>
              {suggestion}
            </Suggestion>)}
        </Suggestions>

        {/* {this.state.suggestions.length < 1 &&
          (this.state.value
            ? <Note>No results were found for "{this.state.value}"</Note>
            : <Note>Continue typing for suggestions...</Note>)} */}

        <Section>
          {this.getOperators().map((operator, key) =>
            <Operator
              key={key}
              active={operator.active}
              onClick={() => this.setOperator(operator.char)}>
              <Key>{operator.char}</Key>
              {operator.name}
            </Operator>)}
        </Section>

        <Section center>
          <Helper>
            <KeyOutline>▲</KeyOutline>
            <KeyOutline>▼</KeyOutline>
            to navigate
          </Helper>

          <Helper>
            <KeyOutline long>↵</KeyOutline>
            to select
          </Helper>
        </Section>

        <Section center>
          <Link
            target='_blank'
            href='https://timber.io/docs/app/console/searching'>
            Learn more
          </Link>
        </Section>
      </Container>
    )
  }
}
