import React from 'react'
import styled from 'styled-components'

const Container = styled.aside`
  display: inline-block;
  background: #808498;
  box-shadow: 0 4px 10px rgba(0, 0, 0, .25);
  border-radius: 2px;
  font-size: 14px;
  font-weight: 400;
  font-family: -apple-system, sans-serif;
  width: 320px;
`

const Inner = styled.div`
  padding: 15px;
  text-align: ${props => props.center ? 'center' : 'inherit'};
  border-bottom: ${props => props.noBorder
    ? 'none'
    : '1px solid rgba(255, 255, 255, .15)'};
`

const Query = styled.div`
  color: #FFFFFF;
  font-size: 18px;
  padding: 5px 15px 7px;
  border-bottom: 1px solid rgba(255, 255, 255, .15);
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
  background: ${props => props.active ? '#676C83' : 'none'};
  font-weight: ${props => props.active ? 500 : 300};
  padding: 2px 15px;
  cursor: pointer;
  &:hover {
    background: #676C83;
    font-weight: 500;
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

export default function (props) {
  return (
    <Container>
      <Query>
        <Attribute>level:</Attribute>debug
      </Query>

      {props.searching &&
        <div>
          <Suggestions>
            <Suggestion>"debug"</Suggestion>
            <Suggestion>info</Suggestion>
            <Suggestion>error</Suggestion>
            <Suggestion>warn</Suggestion>
            <Suggestion active>debug</Suggestion>
            <Suggestion>critical</Suggestion>
            <Suggestion>debug*</Suggestion>
          </Suggestions>

          <Inner>
            <Operator active><Key>:</Key> EQUALS</Operator>
            <Operator><Key>-</Key> DOESN'T EQUAL</Operator>
          </Inner>

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
        </div>}

      {props.done &&
        <div>
          <Note>
            This is a helpful note about conjunctions and other available query helpers.
          </Note>

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
