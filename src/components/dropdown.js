import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { parseToken } from '../utils/token'

import {
  Container,
  Section,
  Suggestions,
  Suggestion,
  Helper,
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
    this.getSuggestions = this.getSuggestions.bind(this)
    this.filterSuggestions = this.filterSuggestions.bind(this)
    this.acceptSuggestion = this.acceptSuggestion.bind(this)
    this.state = {
      attribute: null,
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

  getSuggestions (selectedIdx) {
    const { attributes } = this.props

    return selectedIdx !== null && selectedIdx > -1
      ? attributes[selectedIdx].enumerations || []
      : attributes.map(({ name }) => name)
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
    const { attributes } = this.props
    const {
      suggestions,
      highlightedIdx,
      selectedIdx,
      prepended,
      operator
    } = this.state

    const suggestion = suggestions[highlightedIdx]
    const newValue = selectedIdx > -1
      ? `${attributes[selectedIdx].name}:${operator}${suggestion}`
      : suggestion

    const appended = selectedIdx > -1 ? ' ' : ':'
    this.props.onSelect(`${prepended}${newValue}${appended}`)
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

        {/* <Section>
          {this.getRelatedOperators().map((operator, key) =>
            <Operator
              key={key}
              active={this.state.operator === operator.char}
              onClick={() => this.setOperator(operator.char)}>
              <Key>{operator.char}</Key>
              {operator.name}
            </Operator>)}
        </Section> */}

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
