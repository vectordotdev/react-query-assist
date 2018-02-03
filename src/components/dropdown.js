import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import escape from 'escape-string-regexp'
import Spinner from './spinner'
import Autoinput from './autoinput'
import Button from './button'

const swingDown = keyframes`
  0% {
    opacity: 0;
    transform: perspective(50em) rotateX(-30deg);
  }
  100% {
    opacity: 1;
    transform: perspective(50em) rotateX(0deg);
  }
`

const Container = styled.aside`
  display: inline-block;
  background: #808498;
  box-shadow: 0 4px 10px rgba(0, 0, 0, .25);
  border-radius: 2px;
  font-size: 14px;
  font-weight: 400;
  font-family: -apple-system, sans-serif;
  min-width: 300px;
  transform-origin: 50% 0;
  animation: ${swingDown} ease-in-out 250ms;
`

const Section = styled.section`
  padding: 15px;
  text-align: ${props => props.center ? 'center' : 'inherit'};
  cursor: ${props => props.cursor || 'default'};
  :not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, .15);
  }
`

const Input = styled(Autoinput)`
  display: inline-block;
  background: none;
  border: none;
  outline: none;
  color: #FFFFFF;
  font-size: inherit;
`

const Attribute = styled.span`
  color: rgba(255, 255, 255, 0.5);
  margin-right: 2px;
`

const Suggestions = styled.ul`
  list-style-type: none;
  color: #FFFFFF;
  line-height: 20px;
  margin: 10px 0;
`

const Suggestion = styled.li`
  background: ${props => props.active ? '#6554AF' : 'none'};
  padding: 2px 15px;
  cursor: pointer;
`

const Operator = styled.div`
  display: inline-block;
  background: #676C83;
  border-radius: 2px;
  color: #FFFFFF;
  font-weight: 500;
  padding: 5px 10px;
  margin-right: 5px;
  cursor: pointer;
  opacity: ${props => props.active ? 1 : 0.3};
  &:hover {
    opacity: ${props => props.active ? 1 : 0.6};
  }
`

const Key = styled.div`
  display: inline-block;
  background: #808498;
  border-radius: 2px;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
  vertical-align: middle;
  padding: 2px 5px;
  margin-right: 5px;
`

const KeyOutline = Key.extend`
  background: none;
  border: 1px solid #C3C4CF;
  color: #C3C4CF;
  font-size: 8px;
  padding: 0;
  width: ${props => props.long ? '36px' : '18px'};
  height: 18px;
`

const Helper = styled.div`
  display: inline-block;
  color: #C3C4CF;
  &:not(:last-child) {
    margin-right: 15px;
  }
`

const Note = styled.div`
  color: #C4C5CF;
  font-style: italic;
  text-align: center;
  padding: 15px;
`

class Dropdown extends Component {
  constructor () {
    super()
    this.getSuggestions = this.getSuggestions.bind(this)
    this.keydown = this.keydown.bind(this)
    this.handleDeleteKey = this.handleDeleteKey.bind(this)
    this.handleEnterKey = this.handleEnterKey.bind(this)
    this.handleEscKey = this.handleEscKey.bind(this)
    this.handleArrowKeys = this.handleArrowKeys.bind(this)
    this.handleColonKey = this.handleColonKey.bind(this)
    this.setOperator = this.setOperator.bind(this)
    this.extractOperator = this.extractOperator.bind(this)
    this.getRelatedOperators = this.getRelatedOperators.bind(this)
    this.filterSuggestions = this.filterSuggestions.bind(this)
    this.shiftFocus = this.shiftFocus.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onChangeSimulate = this.onChangeSimulate.bind(this)
    this.buildQuery = this.buildQuery.bind(this)
    this.state = {
      loading: true,
      dirty: false,
      value: '',
      attribute: null,
      operator: '',
      selectedSuggestion: null,
      attributeSuggestions: [],
      valueSuggestions: []
    }
  }

  async componentDidMount () {
    // listen for special keys while the dropdown is open
    document.addEventListener('keydown', this.keydown, false)

    try {
      // get initial list of suggested attributes
      const attributes = (await this.props.getAttributes()) || []

      this.setState({
        loading: false,
        attributeSuggestions: attributes
      })
    } catch (err) {
      console.error('Error with getAttributes:', err)
    }
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.keydown, false)
  }

  componentDidUpdate () {
    // find max index for filtered suggestions
    const max = this.getSuggestions(true).length - 1

    // resets the selector if it goes out of bounds while filtering
    if (max >= 0 && this.state.selectedSuggestion > max) {
      this.setState({ selectedSuggestion: max })
    }
  }

  /**
   * a helper method to get the suggestions--both filtered
   * and not filtered. the filter method constantly runs against
   * the original suggestions, so we need to keep the filtered stuff
   * in a new array. also need to keep original attribute suggestions
   * in case the user shifts back to editing the attribute.
   * (see the shiftFocus method.)
   */
  getSuggestions (filtered) {
    const {
      attribute,
      valueSuggestions,
      valueSuggestionsFiltered,
      attributeSuggestions,
      attributeSuggestionsFiltered
    } = this.state

    // get value suggestions since we already selected an attribute
    if (attribute) {
      return filtered
        ? valueSuggestionsFiltered || valueSuggestions
        : valueSuggestions
    // get attribute suggestions
    } else {
      return filtered
        ? attributeSuggestionsFiltered || attributeSuggestions
        : attributeSuggestions
    }
  }

  /**
   * some keys do special things when the dropdown is open.
   * this maps key codes to their respective methods, and
   * runs anytime a key press occurs.
   */
  keydown (evt) {
    switch (evt.keyCode) {
      case 8: this.handleDeleteKey(evt)
        break
      case 9: // same functionality for tab key
      case 13: this.handleEnterKey(evt)
        break
      case 27: this.handleEscKey(evt)
        break
      case 38:
      case 40: this.handleArrowKeys(evt, evt.keyCode)
        break
      case 186: evt.shiftKey && this.handleColonKey(evt)
        break
    }
  }

  /**
   * since the attribute and value input fields are isolated from
   * each other, this allows us to backtrack to the attribute
   * after we've already shifted to the value. makes it seem
   * like one big input.
   */
  handleDeleteKey (evt) {
    if (this.state.attribute && !this.state.value) {
      evt.preventDefault()

      this.setState({
        // reset the value suggestions since we might pick a different attribute
        valueSuggestions: [],
        valueSuggestionsFiltered: null,
        // shift back over to the attribute if backspacing
        value: this.state.attribute,
        attribute: null
      })
    }
  }

  /**
   * when the dropdown is open, pressing enter/tab simulates
   * clicking the currently active suggestion. will do
   * nothing when there are no suggestions active.
   */
  handleEnterKey (evt) {
    evt.preventDefault()
    this.onChangeSimulate()
  }

  /**
   * close the dropdow without passing through any values
   * when the escape key is pressed.
   */
  handleEscKey (evt) {
    evt.preventDefault()
    this.props.onClose()
  }

  /**
   * for navigating the suggestions with keyboard arrows.
   * this moves the selector up/down by one, and keeps it
   * within the correct bounds by wrapping it.
   */
  handleArrowKeys (evt, keyCode) {
    evt.preventDefault()

    const { selectedSuggestion } = this.state
    const isDownKey = keyCode === 40

    // the furthest down it can go before wrapping
    const max = this.getSuggestions(true).length - 1

    const newIdx = selectedSuggestion !== null
      ? isDownKey ? selectedSuggestion + 1 : selectedSuggestion - 1
      : isDownKey ? 0 : max

    this.setState({
      // make sure it doesn't go out of bounds by resetting to opposite side
      selectedSuggestion: isDownKey
        ? newIdx <= max ? newIdx : 0
        : newIdx >= 0 ? newIdx : max
    })
  }

  /**
   * since attributes and values are seperated by colon,
   * immediately shift the focus to the value when the
   * key is pressed.
   */
  handleColonKey (evt) {
    evt.preventDefault()
    this.shiftFocus()
  }

  /**
   * changes the current operator being used without
   * having to type it, and prepends it to the value.
   * if the old operator and new operator are the same,
   * it toggles it instead. method is called when operator
   * buttons are clicked.
   */
  setOperator (operator) {
    const {
      value: oldValue,
      operator: oldOperator
    } = this.state

    // remove the current operator
    if (operator === oldOperator) {
      const regex = new RegExp(`^${operator}`)
      const value = oldValue.replace(regex, '')

      this.setState({ value, operator: '' })
    // replace the current operator
    } else {
      const value = `${operator}${this.extractOperator(oldValue)}`
      this.setState({ value, operator })
    }

    // since we lose focus when clicking on operator button
    this._input.focus()
  }

  /**
   * extracts predefined operators from the beginning of a value.
   * can specify whether you want to return the value without
   * its operators, or the extracted operator itself.
   */
  extractOperator (value, shouldReturnOperator) {
    // note that order is important. ">=" must come before ">"
    // otherwise ">" will match first, leaving "=" behind
    const operators = ['-', '<=', '>=', '<', '>'].join('|')
    const regex = new RegExp(`^(${operators})?(.*)`)

    return value.replace(regex, shouldReturnOperator ? '$1' : '$2')
  }

  /**
   * finds all the operators that are related to the one that
   * is currently in use. returns the negation operator for
   * attributes only, since tokens can only be negated as a whole.
   * e.g. "-level:info" instead of "level:-info"
   */
  getRelatedOperators () {
    switch (this.state.operator) {
      case '<':
      case '>':
        return [
          { char: '>', name: 'GT' },
          { char: '<', name: 'LT' }
        ]
      case '<=':
      case '>=':
        return [
          { char: '>=', name: 'GTE' },
          { char: '<=', name: 'LTE' }
        ]
      default:
        return !this.state.attribute
          ? [{ char: '-', name: 'NEGATION' }]
          : []
    }
  }

  /**
   * runs the suggestions through a regex filter based on
   * the current input value. also adds additional suggestions
   * (such as wildcards) under different circumstances.
   */
  filterSuggestions (value) {
    const prefiltered = this.extractOperator(value)

    // case insensitive search through each suggestion
    // always use original suggestions, since we don't want a recursive filter
    const filtered = this.getSuggestions().filter(v =>
      new RegExp(escape(prefiltered), 'i').test(v))

    // values sometimes have additional suggestions that attribtues do not
    if (this.state.attribute) {
      // suggestions may be different if the attribute has enums
      const attrHasValues = this.getSuggestions().length > 0

      // suggest quoted value if the attribute has no enums
      const quoteWrapped = value && !attrHasValues && !this.state.operator
        ? `"${value}"` : null

      // do not suggest wildcard if the value has spaces (good?)
      const hasSpaces = value.indexOf(' ') > -1
      const wildcardStr = prefiltered && !hasSpaces
        ? `${prefiltered}*`
        : null

      // need to have at least one result to have a wildcard suggestion
      const wildcard = attrHasValues
        // suggest wildcard unless we reduced enums to zero
        ? filtered.length ? wildcardStr : null
        : wildcardStr

      // combine all the suggestions into a master array,
      // and weed out the nulls from the checks above
      return [quoteWrapped, ...filtered, wildcard].filter(Boolean)
    }

    return filtered
  }

  /**
   * there are three different states of the dropdown--editing an
   * attribute, editing a value, and adding a group (TBD). this
   * handles shifting between the them when necessary.
   */
  async shiftFocus () {
    // we've got a full token, so build the query and close the dropdown
    if (this.state.attribute && this.props.onDone) {
      this.props.onDone(this.buildQuery())
      this.props.onClose()
    // shift from selecting an attribute to selecting a value
    } else {
      const { value } = this.state

      this.setState({
        loading: true,
        // clear out operator to make sure it's not reused
        operator: '',
        // shift the focus by moving value over to attribute
        attribute: value,
        value: ''
      })

      try {
        // prefilter since we don't want operators
        const preFiltered = this.extractOperator(value)
        const values = (await this.props.getValues(preFiltered)) || []

        this.setState({
          loading: false,
          selectedSuggestion: 0,
          valueSuggestions: values,
          // start out suggesting a wildcard for attributes with no enums
          valueSuggestionsFiltered: [...values, '*']
        })
      } catch (err) {
        console.error('Error with getValues:', err)
      }
    }
  }

  /**
   * runs every time the dropdown input value changes. will filter
   * the suggestions, and shift the focus from the attribute to
   * the value when necessary. will close the dropdown if no attribute
   * matches are found. assumed the user is entering a basic keyword.
   */
  onChange (evt, simulated) {
    const { attribute, loading } = this.state

    // make sure whitespace doesn't mess up the filtering
    const value = evt.target.value.trim() || ''

    // only update the value if still loading
    // prevents missed characters when switching between dropdown and search bar
    if (loading) {
      return this.setState({ value })
    }

    const filtered = this.filterSuggestions(value)

    // close dropdown if no attributes are found
    if (!attribute && filtered.length < 1) {
      // pass through value since dropdown no longer handles it
      this.props.onClose && this.props.onClose(value)
    }

    // default to selecting first suggestion if input is dirty,
    // or if there is only one option available to choose from
    const selectedSuggestion =
      (this.state.dirty && !this.state.selectedSuggestion) ||
      filtered.length === 1 ? 0 : this.state.selectedSuggestion

    // are we filtering attributes or values?
    const key = attribute
      ? 'valueSuggestionsFiltered'
      : 'attributeSuggestionsFiltered'

    // extract the operator, if there is one
    const operator = this.extractOperator(value, true)

    // shiftFocus checks need to be in state callback,
    // since it depends on the current value in the state
    this.setState({
      value,
      operator,
      selectedSuggestion,
      [key]: filtered,
      // once input has been touched, so we can adjust selectedSuggestion
      // there is no initial selection when dropdown opens,
      // but once input is dirty, there will always be something selected by default
      dirty: true
    }, () => {
      this.props.onChange &&
        // this also depends on state.value, so keep in callback
        this.props.onChange(this.buildQuery())

      // move on if reduced to an exact match
      const isMatch = filtered.length && value &&
        this.extractOperator(value).toLowerCase() === filtered[0].toLowerCase()

      if (
        // we found an exact match in suggestions
        (isMatch && filtered.length === 1) ||
        // an attribute was autofilled by clicking or pressing enter
        (attribute && simulated)
      ) {
        return this.shiftFocus()
      }
    })
  }

  /**
   * when clicking on suggested values or navigating with keyboard,
   * this simplifies the flow by simulating the onChange event with
   * the autoselected value.
   */
  onChangeSimulate () {
    // get the currently active suggestion,
    const suggestions = this.getSuggestions(true)[this.state.selectedSuggestion]

    // and prepend the operator if there is one
    // need the suggestions default, or it stringifies "undefined"
    const value = `${this.state.operator}${suggestions || ''}`

    // reset selection to top
    value && this.setState({ selectedSuggestion: 0 }, () => {
      // pretend the autofilled value was typed
      this.onChange({ target: { value } }, true)
      // move back to input if we lost focus from the click
      this._input.focus()
    })
  }

  /**
   * this pieces together the final query string for the block.
   * eventually gets passed to the onChange and onDone props.
   */
  buildQuery () {
    const inner = this.state.attribute
      ? `${this.state.attribute}:${this.state.value}`
      : this.state.value

    // isolate block in the parent query by wrapping in parentheses
    return `(${inner})`
  }

  render () {
    // get the filtered suggestions
    const suggestions = this.getSuggestions(true)

    return (
      <Container
        style={this.props.style}
        className={this.props.className}>
        <Section
          cursor='text'
          onClick={() => this._input.focus()}
          innerRef={this.props.containerRef}>
          {this.state.attribute &&
            <Attribute>{this.state.attribute}:</Attribute>}

          <Input
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
            value={this.state.value}
            onChange={this.onChange}
            inputRef={ref => (this._input = ref)} />
        </Section>

        <Suggestions>
          {!this.state.loading && suggestions.map((suggestion, key) =>
            <Suggestion
              key={key}
              active={this.state.selectedSuggestion === key}
              onClick={this.onChangeSimulate}
              onMouseOver={() => this.setState({ selectedSuggestion: key })}>
              {suggestion}
            </Suggestion>)}
        </Suggestions>

        {this.state.loading && <Spinner />}
        {!this.state.loading && !suggestions.length &&
          <Note>
            There are no results for this query.<br />
            Please try again.
          </Note>}

        <Section>
          {this.getRelatedOperators().map((operator, key) =>
            <Operator
              key={key}
              active={this.state.operator === operator.char}
              onClick={() => this.setOperator(operator.char)}>
              <Key>{operator.char}</Key>
              {operator.name}
            </Operator>)}
          {/* <Operator
            active={this.state.operator === '-'}
            onClick={() => this.setOperator('-')}>
            <Key>-</Key>
            NEGATION
          </Operator> */}
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
          <Button href='https://timber.io/docs/app/console/searching'>
            Learn more
          </Button>
        </Section>
      </Container>
    )
  }
}

Dropdown.propTypes = {
  getAttributes: PropTypes.func.isRequired,
  getValues: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onDone: PropTypes.func,
  onClose: PropTypes.func
}

export default Dropdown
