import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'

const swingIn = keyframes`
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
  width: 300px;
  position: absolute;
  top: 10px;
  left: 10px;
  transform-origin: 50% 0;
  animation: ${swingIn} 250ms ease-in-out;
`

const Inner = styled.div`
  padding: 15px;
  text-align: ${props => props.center ? 'center' : 'inherit'};
  border-bottom: ${props => props.noBorder
    ? 'none'
    : '1px solid rgba(255, 255, 255, .15)'};
`

const Query = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, .15);
  color: #FFFFFF;
  font-size: 18px;
  padding: 0 15px;
`

const QueryInput = styled.input`
  background: none;
  border: none;
  outline: none;
  color: inherit;
  font-size: inherit;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  padding: 5px 0 7px;
`

const Attribute = styled.span`
  margin-right: 2px;
  opacity: 0.5;
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

const SuggestionInactive = Suggestion.extend`
  font-style: italic;
  cursor: default;
  opacity: 0.5;
  &:hover {
    background: none;
  }
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
  opacity: ${props => props.active ? 1 : 0.4};
  &:hover {
    opacity: ${props => props.active ? 1 : 0.6};
  }
`

const Helper = styled.div`
  display: inline-block;
  color: #C3C4CF;
  &:not(:last-child) {
    margin-right: 15px;
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

const Note = styled.div`
  color: #C4C5CF;
  font-style: italic;
  padding: 20px;
  padding-bottom: 0;
`

const Button = styled.a`
  display: inline-block;
  background: #6554AF;
  border: 1px solid #58499B;
  border-radius: 4px;
  color: #FFFFFF;
  font-weight: 300;
  text-decoration: none;
  padding: 7px 15px;
  cursor: pointer;
`

export default class extends Component {
  constructor () {
    super()
    this.keydown = this.keydown.bind(this)
    this.select = this.select.bind(this)
    this.state = {
      selectedIdx: null
    }
  }

  componentDidMount () {
    document.addEventListener('keydown', this.keydown, false)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.keydown, false)
  }

  componentDidUpdate () {
    const maxIndex = this.props.suggestions.length - 1

    // default to selecting the first option only after typing something
    if (this.state.selectedIdx === null && this.props.value) {
      this.setState({ selectedIdx: 0 })
    }

    // to make sure selection doesn't go out of bounds when filtering,
    // this keeps the last item selected as list gets reduced
    if (maxIndex >= 0 && this.state.selectedIdx > maxIndex) {
      this.setState({ selectedIdx: maxIndex })
    }
  }

  keydown (e) {
    const codes = [13, 38, 40]

    if (codes.indexOf(e.keyCode) > -1) {
      e.preventDefault()
    }

    // enter key
    if (e.keyCode === codes[0]) {
      this.select()
    }

    // up arrow key
    if (e.keyCode === codes[1]) {
      // start from bottom of list if nothing is currently selected
      const newIdx = this.state.selectedIdx !== null
        ? this.state.selectedIdx - 1
        : this.props.suggestions.length - 1

      this.setState({
        selectedIdx: newIdx > 0 ? newIdx : 0
      })
    }

    // down arrow key
    if (e.keyCode === codes[2]) {
      const max = this.props.suggestions.length - 1
      // start from top of list if nothing is currently selected
      const newIdx = this.state.selectedIdx !== null
        ? this.state.selectedIdx + 1
        : 0

      this.setState({
        selectedIdx: newIdx < max ? newIdx : max
      })
    }
  }

  select () {
    const idx = this.state.selectedIdx
    const selected = this.props.suggestions[idx]

    this.props.select(selected)
  }

  render () {
    const {
      loading,
      onChange,
      attribute,
      value,
      suggestions,
      note,
      innerRef
    } = this.props

    return (
      <Container>
        <Query>
          {attribute &&
            <Attribute>{attribute}:</Attribute>}

          <QueryInput
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
            onChange={onChange}
            value={value}
            innerRef={innerRef} />
        </Query>

        <Suggestions>
          {suggestions.map((suggestion, key) =>
            <Suggestion
              key={key}
              active={this.state.selectedIdx === key}
              onClick={this.select}
              onMouseOver={() => this.setState({ selectedIdx: key })}>
              {suggestion}
            </Suggestion>)}

          {loading &&
            <SuggestionInactive>Loading...</SuggestionInactive>}
        </Suggestions>

        {attribute &&
          <Inner>
            <Operator active>
              <Key>:</Key>
              EQUALS
            </Operator>

            <Operator>
              <Key>-</Key>
              DOESN{`'`}T EQUAL
            </Operator>
          </Inner>}

        <Inner center>
          <Helper>
            <KeyOutline>▲</KeyOutline>
            <KeyOutline>▼</KeyOutline>
            to navigate
          </Helper>

          <Helper>
            <KeyOutline long>↵</KeyOutline>
            to select
          </Helper>
        </Inner>

        {note &&
          <div>
            <Note>{note}</Note>

            <Inner center>
              <Helper>
                <KeyOutline long>↵</KeyOutline>
                to close
              </Helper>
            </Inner>
          </div>}

        <Inner center noBorder>
          <Button
            target='_blank'
            href='https://timber.io/docs/app/console/searching'>
            Learn more
          </Button>
        </Inner>
      </Container>
    )
  }
}
