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

const Title = styled.h2`
  color: #FFFFFF;
  margin-bottom: 15px;
  font-weight: 600;
`

const Assist = styled(QueryAssist)`
  margin-bottom: 50px;
`

const Footer = styled.div`
  padding: 15px;
  text-align: center;
`

export const Link = styled.a`
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
    const footer = () => (
      <Footer>
        <Link
          target='_blank'
          href='https://timber.io/docs/app/console/searching'>
          Learn more
        </Link>
      </Footer>
    )

    return (
      <Container>
        <Title>Basic Example</Title>
        <Assist
          placeholder='Search Logs ⌘ ⇧ F'
          getData={this.getData}
          onSubmit={query => console.log(`output query: ${query}`)}
          footerComponent={footer} />

        <Title>Complex Query Example</Title>
        <Assist
          placeholder='Search Logs ⌘ ⇧ F'
          getData={this.getData}
          onSubmit={query => console.log(`output query: ${query}`)}
          defaultValue={`keyword1 (level:error AND heroku.source:"foo bar") keyword2 http.method:POST\n\t(-level:info OR http_response.status:>=400)\nkeyword3 invalid:token heroku.dyno_id:abc*`}
          footerComponent={footer} />
      </Container>
    )
  }
}

render(<Demo />, document.querySelector('#demo'))
