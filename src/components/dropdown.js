import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { tokenRegex } from '../utils/regex'

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
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
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
      suggestions: [],
      highlightedIdx: 0,
      selectedIdx: null
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
    // if (this.state.suggestions.length === 0) {
    //   this.props.onClose()
    // }
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
      ? attributes[selectedIdx].enumerations
      : attributes.map(({ name }) => name)
  }

  filterSuggestions (value) {
    const token = tokenRegex({ noAttr: true }).exec(value) || []
    console.log(token)

    // const attributeName = token[2]
    // const attributeValue = token[4]
    // const attributeIdx = this.props.attributes
    //   .findIndex(({ name }) => name === attributeName)
    //
    // const selectedIdx = attributeIdx > -1 ? attributeIdx : -1
    // const searchValue = selectedIdx > -1 ? attributeValue : value

    const suggestions = this.getSuggestions()
    const filtered = suggestions.filter(v =>
      new RegExp(escape(value), 'i').test(v))

    this.setState({
      suggestions: filtered,
      // reset selector to top each time value changes
      highlightedIdx: 0
    })
  }

  acceptSuggestion () {
    const {
      suggestions,
      highlightedIdx,
      selectedIdx
    } = this.state

    const suggestion = suggestions[highlightedIdx]
    const newValue = suggestion
    // const newValue = selectedIdx
    //   ? `${this.props.attributes[selectedIdx].name}:${suggestion}`
    //   : suggestion

    const appended = selectedIdx ? ' ' : ':'
    this.props.onSelect(`${newValue}${appended}`)
  }

  render () {
    const style = {
      left: `${this.props.offsetX || 0}px`,
      top: `${this.props.offsetY || 0}px`
    }

    return (
      <Container
        tabIndex='0'
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
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
