import styled from 'styled-components'
import Textarea from 'react-textarea-autosize'

export const Container = styled.div`
  position: relative;
  width: 100%;
`

export const InputContainer = styled.div`
  background: #393B4A;
  border: 1px solid #1F1E21;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 300;
  font-family: 'Courier New', Courier, monospace;
  position: relative;
  cursor: text;
`

export const Input = styled(Textarea)`
  display: block;
  background: none;
  border: none;
  outline: none;
  resize: none;
  font: inherit;
  color: #9FA2B2;
  width: 100%;
  padding: 15px 20px;
  line-height: 20px;
  white-space: pre-wrap;
  word-wrap: break-word;
  ::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
`

export const Overlay = Input.withComponent('div').extend`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
`

export const Inline = styled.span`
  font: inherit;
  line-height: 20px;
`

export const Token = Inline.extend`
  color: #FFFFFF;
  cursor: pointer;
  pointer-events: auto;
  position: relative;
  &:after {
    content: '';
    background: #FFFFFF;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    height: 1px;
    opacity: 0;
    transform: translateY(3px);
    transition: all 150ms;
  }
  &:hover:after {
    opacity: 1;
    transform: translateY(0px);
  }
`
