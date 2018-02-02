import React, { Component } from 'react'
import { render } from 'react-dom'
import styled, { injectGlobal } from 'styled-components'
import QueryAssist from '../../src'

injectGlobal`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`

const Container = styled.div`
  background: #282B37;
  width: 100vw;
  height: 100vh;
  padding: 20px;
`

class Demo extends Component {
  async getAttributes () {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return [
      'level',
      'http.method',
      'http_response.status',
      'heroku.dyno_id',
      'heroku.source'
    ]
  }

  async getValues (attr) {
    await new Promise(resolve => setTimeout(resolve, 1000))
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
          getValues={this.getValues}
          onQuery={query => console.log(query)} />
      </Container>
    )
  }
}

render(<Demo />, document.querySelector('#demo'))
