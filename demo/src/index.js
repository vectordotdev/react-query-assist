import React, { Component } from 'react'
import { render } from 'react-dom'
import styled, { injectGlobal } from 'styled-components'
import QueryAssist from '../../src'

injectGlobal`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, sans-serif;
  }
`

const Container = styled.div`
  background: #282B37;
  width: 100vw;
  height: 100vh;
  padding: 20px;
`

class Demo extends Component {
  async getData () {
    await new Promise(resolve => setTimeout(resolve, 100))

    return [
      {
        name: 'level',
        type: 'string',
        enumerations: ['info', 'error', 'warn', 'debug', 'critical']
      },
      {
        name: 'http.method',
        type: 'string',
        enumerations: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
      },
      {
        name: 'http_response.status',
        type: 'int',
        enumerations: [200, 400, 404, 500]
      },
      {
        name: 'heroku.dyno_id',
        type: 'string',
        enumerations: []
      },
      {
        name: 'heroku.source',
        type: 'string',
        enumerations: null
      }
    ]
  }

  render () {
    return (
      <Container>
        <QueryAssist
          placeholder='Search Logs ⌘ ⇧ F'
          getData={this.getData}
          onSubmit={query => console.log(`output query: ${query}`)} />
      </Container>
    )
  }
}

render(<Demo />, document.querySelector('#demo'))
