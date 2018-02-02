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
    this.addBlock = this.addBlock.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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

  closeDropdown () {
    this.setState({
      dropdownOpen: false
    })
  }

  addBlock (block) {
    this.setState({
      currentQuery: `${this.state.currentQuery}${block} `
    })
  }

  handleSubmit (evt) {
    evt.preventDefault()
    this.props.onQuery(this.state.currentQuery)
  }

  render () {
    return (
      <Container>
        <form onSubmit={this.handleSubmit}>
          <Input
            value={this.state.currentQuery}
            onFocus={this.openDropdown} />
        </form>

        {this.state.dropdownOpen &&
          <Dropdown
            getAttributes={this.props.getAttributes}
            getValues={this.props.getValues}
            onDone={this.addBlock}
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
