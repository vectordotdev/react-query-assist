// TODO:
// - figure out how to make contentEditable work
// - display tokens as react components
// - position dropdown where the cursor is

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import DropdownUnstyled from './components/dropdown'

const Container = styled.div`
  position: relative;
  width: 100%;
`

const Input = styled.input`
  background: #393B4A;
  border: 1px solid #1F1E21;
  border-radius: 4px;
  color: #9FA2B2;
  font-size: 16px;
  font-weight: 300;
  width: 100%;
  padding: 15px 20px;
  cursor: text;
  outline: none;
`

const Dropdown = styled(DropdownUnstyled)`
  position: absolute;
  top: 100%;
  left: 0;
`

class QueryAssist extends Component {
  constructor () {
    super()
    this.openDropdown = this.openDropdown.bind(this)
    this.closeDropdown = this.closeDropdown.bind(this)
    this.onDone = this.onDone.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.state = {
      currentQuery: '',
      dropdownOpen: false
    }
  }

  openDropdown () {
    this.setState({
      dropdownOpen: true
    }, () => this._dropdown.click())
  }

  closeDropdown (value) {
    const newState = { dropdownOpen: false }

    if (value) {
      newState.currentQuery = `${this.state.currentQuery}${value}`
    }

    this.setState(newState, () => this._input.focus())
  }

  onDone (block) {
    this.setState({
      currentQuery: `${this.state.currentQuery}${block}`
    })
  }

  onFocus (evt) {
    const { currentQuery } = this.state

    if (!currentQuery) {
      this.openDropdown()
    }
  }

  onKeyDown (evt) {
    this._timer && clearTimeout(this._timer)

    if (evt.keyCode === 32) {
      this._timer = setTimeout(() => {
        this.setState({
          currentQuery: `${this.state.currentQuery} `
        }, () => this.openDropdown())
      }, 500)
    }
  }

  onChange (evt) {
    this.setState({
      currentQuery: evt.target.value
    })
  }

  onSubmit (evt) {
    evt.preventDefault()
    this.props.onQuery(this.state.currentQuery)
  }

  render () {
    return (
      <Container>
        <form onSubmit={this.onSubmit}>
          <Input
            autoComplete='off'
            autoCorrect='off'
            autoCapitalize='off'
            spellCheck='false'
            value={this.state.currentQuery}
            onKeyDown={this.onKeyDown}
            onFocus={this.onFocus}
            onChange={this.onChange}
            innerRef={ref => (this._input = ref)} />
        </form>

        {this.state.dropdownOpen &&
          <Dropdown
            getAttributes={this.props.getAttributes}
            getValues={this.props.getValues}
            onDone={this.onDone}
            onClose={this.closeDropdown}
            containerRef={ref => (this._dropdown = ref)} />}
      </Container>
    )
  }
}

QueryAssist.propTypes = {
  getAttributes: PropTypes.func.isRequired,
  getValues: PropTypes.func.isRequired,
  onQuery: PropTypes.func.isRequired
}

export default QueryAssist
