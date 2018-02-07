import styled, { keyframes } from 'styled-components'

export const swingDown = keyframes`
  0% {
    opacity: 0;
    transform: perspective(50em) rotateX(-30deg);
  }
  100% {
    opacity: 1;
    transform: perspective(50em) rotateX(0deg);
  }
`

export const Container = styled.aside`
  display: inline-block;
  background: #808498;
  box-shadow: 0 4px 10px rgba(0, 0, 0, .25);
  border-radius: 2px;
  outline: none;
  font-size: 14px;
  font-weight: 400;
  font-family: -apple-system, sans-serif;
  min-width: 300px;
  position: absolute;
  transform-origin: 50% 0;
  animation: ${swingDown} ease-in-out 250ms;
  transition: all 100ms;
`

export const Section = styled.section`
  padding: 15px;
  text-align: ${props => props.center ? 'center' : 'inherit'};
  :not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, .15);
  }
`

export const Suggestions = styled.ul`
  list-style-type: none;
  color: #FFFFFF;
  line-height: 20px;
  margin: 10px 0;
`

export const Suggestion = styled.li`
  background: ${props => props.active ? '#6554AF' : 'none'};
  padding: 2px 15px;
  cursor: pointer;
`

export const Operator = styled.div`
  display: inline-block;
  background: #676C83;
  border-radius: 2px;
  color: #FFFFFF;
  font-weight: 500;
  padding: 5px 10px;
  margin-right: 5px;
  cursor: pointer;
  opacity: ${props => props.active ? 1 : 0.3};
  &:hover {
    opacity: ${props => props.active ? 1 : 0.6};
  }
`

export const Key = styled.div`
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

export const KeyOutline = Key.extend`
  background: none;
  border: 1px solid #C3C4CF;
  color: #C3C4CF;
  font-size: 8px;
  padding: 0;
  width: ${props => props.long ? '36px' : '18px'};
  height: 18px;
`

export const Helper = styled.div`
  display: inline-block;
  color: #C3C4CF;
  &:not(:last-child) {
    margin-right: 15px;
  }
`

export const Note = styled.div`
  color: #C4C5CF;
  font-style: italic;
  text-align: center;
  padding: 15px;
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
