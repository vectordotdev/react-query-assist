import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    getData: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.keydown = this.keydown.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onAutosuggest = this.onAutosuggest.bind(this)
    this.onSelectValue = this.onSelectValue.bind(this)
    this.onClickToken = this.onClickToken.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onCloseCancel = this.onCloseCancel.bind(this)
    this.getCurrentChunk = this.getCurrentChunk.bind(this)
    this.extractTokens = this.extractTokens.bind(this)
    this.buildOverlay = this.buildOverlay.bind(this)
    this.state = {
      value: props.defaultValue || '',
      // value: 'keyword1 (level:error AND something:"foo bar") keyword2 http.method:POST\n\thello level:info',
      attributes: [],
      overlayComponents: [],
      dropdownOpen: false,
      dropdownValue: null,
      dropdownX: null,
      dropdownY: null
    }
  }

  async componentDidMount () {
    document.addEventListener('keydown', this.keydown, false)

    try {
      this.setState({
        attributes: await this.props.getData(),
        overlayComponents: this.buildOverlay(this.state.value)
      })
    } catch (err) {
      console.error('Error while getting data:', err)
    }
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.keydown, false)
  }

  keydown (evt) {
    // submit on enter, line break on shift enter
    if (!evt.shiftKey && evt.keyCode === 13) {
      evt.preventDefault()
      this.props.onSubmit(this.state.value)
    }
  }

  onChange (evt) {
    this.setState({
      value: evt.target.value
    })
  }

  onSelect (evt) {
    const { value } = evt.target

    this.setState({
      overlayComponents: this.buildOverlay(value)
    }, this.onAutosuggest)
  }

  onAutosuggest () {
    const {
      value
    } = this.state

    const {
      offsetLeft,
      offsetTop
    } = this._marker

    const {
      chunk,
      shouldSuggest
    } = this.getCurrentChunk(value)

    if (shouldSuggest) {
      this.setState({
        dropdownOpen: true,
        dropdownValue: chunk,
        dropdownX: offsetLeft,
        dropdownY: offsetTop + 25 // line-height + 5 extra padding
      })
    } else {
      this.setState({
        dropdownOpen: false
      })
    }
  }

  onSelectValue (newValue) {
    const { value } = this.state
    const {
      index,
      indexEnd
    } = this.getCurrentChunk(value)

    this.setState({
      value: `${value.slice(0, index)}${newValue}${value.slice(indexEnd)}`
    })
  }

  onClickToken (position) {
    // moves caret to the beginning of the token
    this._input.setSelectionRange(position, position)
  }

  onClose () {
    // hack to prevent the dropdown from closing when it is clicked
    this._closing = setTimeout(() => {
      this.setState({
        dropdownOpen: false
      })
    }, 10)
  }

  onCloseCancel () {
    clearTimeout(this._closing)
  }

  getCurrentChunk (value) {
    const {
      selectionStart
    } = this._input

    // get location of each token found in value
    const tokens = this.extractTokens(value)

    // find index of the closest previous whitespace
    const prevStr = value.substring(0, selectionStart)
    const prevMatch = prevStr.match(/[^\s]*$/)
    const prevIdx = prevMatch
      ? prevStr.lastIndexOf(prevMatch[prevMatch.length - 1])
      : -1

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

    // extract value of current chunk
    const chunk = value.substring(index, selectionStart)
    // calculate the location where the chunk ends
    const indexEnd = index + chunk.length

    // whether the chunk should open the autocomplete dropdown
    const shouldSuggest = true // TODO

    return {
      index,
      indexEnd,
      chunk,
      shouldSuggest
    }
  }

  extractTokens (value) {
    const positions = []
    const regex = /([\w.-]+):(".+?"|[^\s():]+)/g

    let result
    while ((result = regex.exec(value)) !== null) {
      // TODO: validate against actual list of tokens

      const startPosition = result.index
      const endPosition = regex.lastIndex

      positions.push([startPosition, endPosition])
    }

    return positions
  }

  buildTokens (value, relativeToIdx = 0) {
    const chunks = []
    const positions = this.extractTokens(value)

    let currentPosition = 0
    positions.reduce((prev, next) => {
      const locationInInput = next[1] + relativeToIdx

      chunks.push(value.substring(prev[1], next[0]))
      chunks.push(
        <Token
          key={`token-${next[0]}`}
          onClick={() => this.onClickToken(locationInInput)}>
          {value.substring(next[0], next[1])}
        </Token>
      )

      currentPosition = next[1]
      return next
    }, [null, 0])

    chunks.push(value.substring(currentPosition))
    return chunks
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

    // since it will never split up a tokens,
    // we can build the tokens independently on each side
    return [
      stuffOnLeft,
      <Inline
        // style={{ outline: '1px solid red' }}
        key={`after-${index}`}
        innerRef={ref => (this._marker = ref)}>
        {stuffOnRight}
      </Inline>
    ]
  }

  render () {
    return (
      <Container>
        <InputContainer>
          <Overlay>
            {this.state.overlayComponents}
          </Overlay>

          <Input
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
            placeholder={this.props.placeholder || 'Search'}
            value={this.state.value}
            onChange={this.onChange}
            onSelect={this.onSelect}
            onBlur={this.onClose}
            inputRef={ref => (this._input = ref)} />
        </InputContainer>

        {this.state.dropdownOpen &&
          <Dropdown
            attributes={this.state.attributes}
            value={this.state.dropdownValue}
            onSelect={this.onSelectValue}
            onClose={this.onClose}
            onFocus={this.onCloseCancel}
            onBlur={this.onClose}
            offsetX={this.state.dropdownX}
            offsetY={this.state.dropdownY} />}
      </Container>
    )
  }
}
