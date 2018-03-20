import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageClick from 'react-page-click'
import { extractTokens } from './utils/token'
import Dropdown from './components/dropdown'

import {
  Container,
  InputContainer,
  Input,
  Overlay,
  Inline,
  Token
} from './index.styl'

export default class extends Component {
  static propTypes = { // eslint-disable-line
    debug: PropTypes.bool,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    getData: PropTypes.func,
    onSubmit: PropTypes.func,
    keyboardHelpers: PropTypes.bool,
    footerComponent: PropTypes.func,
    inputProps: PropTypes.object,
    tokenProps: PropTypes.object,
    dropdownProps: PropTypes.object,
    selectorProps: PropTypes.object
  }

  static defaultProps = { // eslint-disable-line
    getData: () => Promise.resolve([]),
    onSubmit: console.log,
    placeholder: 'Search',
    inputProps: {},
    tokenProps: {},
    dropdownProps: {},
    selectorProps: {}
  }

  constructor (props) {
    super(props)
    this.keydown = this.keydown.bind(this)
    this.handleEnterKey = this.handleEnterKey.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onAutosuggest = this.onAutosuggest.bind(this)
    this.onSelectValue = this.onSelectValue.bind(this)
    this.shouldAutosuggest = this.shouldAutosuggest.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onClickToken = this.onClickToken.bind(this)
    this.getCurrentChunk = this.getCurrentChunk.bind(this)
    this.buildOverlay = this.buildOverlay.bind(this)
    this.state = {
      loading: true,
      value: props.defaultValue || '',
      attributes: [],
      overlayComponents: [],
      dropdownClosed: false,
      dropdownOpen: false,
      dropdownValue: null,
      dropdownX: null,
      dropdownY: null
    }
  }

  componentDidMount () {
    document.addEventListener('keydown', this.keydown, false)

    this.props.getData()
      .then(res => this.setState({ attributes: res, loading: false }))
      .catch(err => console.error('Error while getting data:', err))
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.keydown, false)
  }

  componentDidUpdate (prevProps, prevState) {
    const {
      value,
      attributes
    } = this.state

    if (
      value !== prevState.value ||
      attributes.length !== prevState.attributes.length
    ) {
      this.setState({
        overlayComponents: this.buildOverlay(value)
      })
    }
  }

  keydown (evt) {
    switch (evt.keyCode) {
      case 13: // enter key
        this.handleEnterKey(evt)
        break
    }
  }

  handleEnterKey (evt) {
    // whether this input is infocus
    const isFocused = document.activeElement === this._input

    // submit on enter, line break on shift enter
    // dropdown handles enter key as well, so prevent clash
    if (!evt.shiftKey && isFocused && !this.state.dropdownOpen) {
      evt.preventDefault()
      this.props.onSubmit(this.state.value)
    }
  }

  onChange (evt) {
    this.setState({
      value: evt.target.value
    }, this.onAutosuggest)
  }

  onSelect (evt) {
    const { value } = evt.target

    this.setState({
      overlayComponents: this.buildOverlay(value)
    }, this.onAutosuggest)
  }

  onAutosuggest () {
    const { value } = this.state
    const {
      offsetLeft,
      offsetTop
    } = this._marker

    const { chunk } = this.getCurrentChunk(value)
    const suggest = this.shouldAutosuggest(chunk)

    if (suggest) {
      this.setState({
        dropdownClosed: false,
        dropdownOpen: true,
        dropdownValue: chunk,
        dropdownX: offsetLeft,
        dropdownY: offsetTop + 25 // line height + 5 extra padding
      })
    } else {
      this.setState({
        dropdownOpen: false
      })
    }
  }

  onSelectValue (chunk, appended = '') {
    const { value } = this.state
    const {
      index,
      indexEnd
    } = this.getCurrentChunk(value)

    const before = value.slice(0, index)
    const after = value.slice(indexEnd)
    const position = index + chunk.length + appended.length
    const positionEnd = position + after.length

    this.setState({
      value: appended === ' ' && position < positionEnd
        ? `${before}${chunk}${after}`
        : `${before}${chunk}${appended}${after}`
    }, () => {
      // position caret at the end of the inserted value
      this._input.focus()
      this._input.setSelectionRange(position, position)
    })
  }

  shouldAutosuggest (chunk) {
    const { selectionStart } = this._input
    const { value } = this.state

    // next character is whitespace, closing paren or null
    const nextCharIsEmpty = !value.charAt(selectionStart) ||
      /[)\s]/.test(value.charAt(selectionStart))

    // whitespace/negation/paren before and whitespace after caret
    const isNewWord = nextCharIsEmpty &&
      /[\s-(]/.test(value.charAt(selectionStart - 1))

    // cursor is at end of the current word
    const atEndOfWord = nextCharIsEmpty &&
      /[^)\s]/.test(value.charAt(selectionStart - 1))

    return !value || isNewWord ||
      (atEndOfWord && !this.state.dropdownClosed)
  }

  onClose (forWord) {
    this.setState({
      dropdownOpen: false,
      // don't reopen if it was closed for current word
      dropdownClosed: forWord || false
    })
  }

  onClickToken (start, end) {
    // move cursor to end of token
    this._input.focus()
    this._input.setSelectionRange(end, end)
  }

  getCurrentChunk (value) {
    const {
      selectionStart
    } = this._input

    // get location of each token found in value
    const tokens = extractTokens(value, this.state.attributes)

    // find index of the closest previous whitespace
    const prevStr = value.substring(0, selectionStart)
    const prevMatch = prevStr.match(/[^\s]*$/)
    const prevIdx = prevMatch ? prevStr.lastIndexOf(prevMatch[prevMatch.length - 1]) : -1

    // determine correct index for the start of the chunk
    let index = prevIdx
    for (const [start, end] of tokens.reverse()) {
      // token is between whitespace and cursor
      if (selectionStart > end && prevIdx < start) {
        index = end
        break
      }
      // at the end of or inside a token (thats what she said)
      if (selectionStart > start && selectionStart <= end) {
        index = start
        break
      }
      // there is whitespace in the token
      if (prevIdx > start && prevIdx < end) {
        index = end
        break
      }
    }

    // value is result of cursor back to beginning of chunk
    const chunk = value.substring(index, selectionStart)
    const indexEnd = index + chunk.length

    return {
      index,
      indexEnd,
      chunk
    }
  }

  buildTokens (value, relativeToIdx = 0) {
    const chunks = []
    const positions = extractTokens(value, this.state.attributes)

    let currentPosition = 0
    positions.reduce((prev, next) => {
      const startIdx = next[0] + relativeToIdx
      const endIdx = next[1] + relativeToIdx

      chunks.push(value.substring(prev[1], next[0]))
      chunks.push(
        <Token {...this.props.tokenProps}
          key={`token-${next[0]}`}
          onClick={() => this.onClickToken(startIdx, endIdx)}>
          {value.substring(next[0], next[1])}
        </Token>
      )

      currentPosition = next[1]
      return next
    }, [null, 0])

    chunks.push(value.substring(currentPosition))
    return chunks.filter(Boolean)
  }

  buildOverlay (value) {
    // figure out where we should split the overlay,
    // so we know where to position the dropdown
    const { index } = this.getCurrentChunk(value)

    // everything to the left of the current word/token
    const stuffOnLeft = this.buildTokens(value.substring(0, index))

    // everything to the right of the current word/token
    // need to have default whitespace or dropdown will not find position of caret
    const stuffOnRight = this.buildTokens(value.substring(index) || ' ', index)

    // since it will never split up a token,
    // we can build each side of cursor independently
    return [
      stuffOnLeft,
      <Inline
        key={`after-${index}`}
        style={{ outline: this.props.debug ? '1px solid red' : 'none' }}
        innerRef={ref => (this._marker = ref)}>
        {stuffOnRight}
      </Inline>
    ]
  }

  render () {
    return (
      <PageClick
        outsideOnly
        notify={this.onClose}>
        <Container
          className={this.props.className}>
          <InputContainer
            {...this.props.inputProps}>
            <Overlay>
              {this.state.overlayComponents}
            </Overlay>

            <Input
              autoComplete='off'
              autoCorrect='off'
              autoCapitalize='off'
              spellCheck='false'
              placeholder={this.props.placeholder}
              placeholderColor={this.props.inputProps.placeholderColor}
              value={this.state.value}
              onChange={this.onChange}
              onSelect={this.onSelect}
              inputRef={ref => (this._input = ref)} />
          </InputContainer>

          {this.state.dropdownOpen && !this.state.loading &&
            <Dropdown
              keyboardHelpers={this.props.keyboardHelpers}
              footerComponent={this.props.footerComponent}
              attributes={this.state.attributes}
              value={this.state.dropdownValue}
              onSelect={this.onSelectValue}
              onClose={this.onClose}
              offsetX={this.state.dropdownX}
              offsetY={this.state.dropdownY}
              dropdownProps={this.props.dropdownProps}
              selectorProps={this.props.selectorProps} />}
        </Container>
      </PageClick>
    )
  }
}
