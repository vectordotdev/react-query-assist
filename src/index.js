import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import escRegex from 'escape-string-regexp'
import Dropdown from './dropdown'

const Container = styled.div`
  position: relative;
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

class QueryAssist extends Component {
  constructor () {
    super()
    this.openDropdown = this.openDropdown.bind(this)
    this.select = this.select.bind(this)
    this.onChange = this.onChange.bind(this)
    this.state = {
      query: '',
      loading: true,
      isOpen: false,
      suggestions: [],
      attributeName: null,
      attributeValue: null
    }
  }

  async openDropdown () {
    this.setState({
      isOpen: true
    })

    try {
      const suggestions = (await this.props.getAttributes())
        .map(suggestion => `${suggestion}:`)

      // const suggestions = this.state.attributeName
      //   ? await this.props.getValues(this.state.attributeName)
      //   : await this.props.getAttributes()

      this._input.focus()
      this.setState({
        loading: false,
        suggestions: suggestions
      })
    } catch (err) {
      console.error(err)
    }
  }

  select (val) {
    this._input.focus()
    this.setState({
      query: val
    })
  }

  onChange (e) {
    const query = e.target.value
    const newState = {
      query: query,
      // dont filter original array so you can backtrack
      suggestionsAddedTo: this.state.suggestions
    }

    if (query) {
      const isExactMatch = this.state.suggestions.indexOf(query) > -1
      const hasSpaces = query.indexOf(' ') > -1

      newState.suggestionsAddedTo = [
        // suggests a string wrapped in quotes as default,
        // unless there is a suggestion that matches one to one
        isExactMatch ? null : `"${query}"`,
        ...this.state.suggestions
          // case insensitive search for autocomplete results
          .filter(v => new RegExp(escRegex(query), 'i').test(v)),
        // suggest a wildcard if there are no spaces
        hasSpaces ? null : `${query}*`
      ].filter(Boolean)
    }

    this.setState(newState)
  }

  render () {
    return (
      <Container>
        <Input
          value={this.state.query}
          onFocus={this.openDropdown} />

        {this.state.isOpen &&
          <Dropdown
            loading={this.state.loading}
            onChange={this.onChange}
            select={this.select}
            value={this.state.query}
            suggestions={this.state.suggestionsAddedTo || this.state.suggestions}
            innerRef={ref => (this._input = ref)} />}
      </Container>
    )
  }
}

QueryAssist.propTypes = {
  getAttributes: PropTypes.func.isRequired,
  getValues: PropTypes.func.isRequired
}

export default QueryAssist
