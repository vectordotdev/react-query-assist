import React, { Component } from 'react'
import { render } from 'react-dom'
import styled, { injectGlobal } from 'styled-components'
// import QueryAssist from '../../src'
import Dropdown from '../../src/dropdown'

injectGlobal`
  * {
    margin: 0;
    padding: 0;
  }
`

const Container = styled.div`
  background: #282B37;
  width: 100vw;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
`

class Demo extends Component {
  render () {
    return (
      <Container>
        {/* <QueryAssist /> */}
        <Dropdown searching />
        <Dropdown done />
      </Container>
    )
  }
}

render(<Demo />, document.querySelector('#demo'))
