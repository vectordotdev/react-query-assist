import React, { Component } from 'react'
import { render } from 'react-dom'
import styled, { injectGlobal } from 'styled-components'
import QueryAssist from '../../src'

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
  async getAttributes () {
    await new Promise(resolve => setTimeout(resolve, 100))
    return [
      'level',
      'http.method',
      'http_response.status',
      'heroku.dyno_id',
      'heroku.source'
    ]
  }

  async getValues (attr) {
    await new Promise(resolve => setTimeout(resolve, 100))
    if (attr === 'level') {
      return [
        'info',
        'error',
        'warn',
        'debug',
        'critical'
      ]
    }
    if (attr === 'http.method') {
      return [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE'
      ]
    }
  }

  render () {
    return (
      <Container>
        <QueryAssist
          getAttributes={this.getAttributes}
          getValues={this.getValues} />
      </Container>
    )
  }
}

render(<Demo />, document.querySelector('#demo'))
