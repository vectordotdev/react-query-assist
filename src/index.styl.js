import styled from 'styled-components'
import Textarea from 'react-textarea-autosize'

export const Container = styled.div`
  position: relative;
  width: 100%;
`

export const InputContainer = styled.div.attrs({
  style: props => props.theme
})`
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
  width: 100%;
  padding: 15px 20px;
  line-height: 20px;
  white-space: pre-wrap;
  word-wrap: break-word;
  /* we only want overlay text visible */
  /* need to do this so caret still shows up */
  color: inherit;
  -webkit-text-fill-color: transparent;
  ::placeholder {
    color: ${props => props.theme.placeholderColor};
    -webkit-text-fill-color: initial;
  }
`

export const Overlay = Input.withComponent('div').extend`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  /* reversed from Input above */
  -webkit-text-fill-color: initial;
`

export const Inline = styled.span`
  font: inherit;
  line-height: 20px;
`

export const Token = Inline.extend`
  color: ${props => props.theme.tokenColor};
  font-weight: 500;
  cursor: pointer;
  pointer-events: auto;
  position: relative;
  &:after {
    content: '';
    background: ${props => props.theme.tokenColor};
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
