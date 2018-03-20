import styled from 'styled-components'
import Textarea from 'react-textarea-autosize'
import clean from 'clean-element'

import {
  propTypes,
  space,
  width,
  color,
  borders,
  borderRadius,
  boxShadow,
  fontSize,
  fontWeight,
  fontFamily,
  lineHeight,
  textAlign,
  letterSpacing
} from 'styled-system'

export const Container = styled.div`
  position: relative;
  width: 100%;
`

export const InputContainer = styled.div`
  position: relative;

  ${space}
  ${width}
  ${borders}
  ${borderRadius}
  ${boxShadow}
  ${color}
  ${fontSize}
  ${fontWeight}
  ${fontFamily}
  ${lineHeight}
  ${letterSpacing}
  ${textAlign}
`

InputContainer.defaultProps = {
  bg: '#FFFFFF',
  color: '#505050',
  border: '1px solid rgba(0, 0, 0, .1)',
  fontFamily: 'monospace',
  lineHeight: '20px'
}

const CleanInput = clean(Textarea)

CleanInput.propTypes = {
  placeholderColor: propTypes.color.color,
  ...propTypes.borderRadius
}

export const Input = styled(CleanInput)`
  display: block;
  background: none;
  border: none;
  outline: none;
  resize: none;
  font: inherit;
  width: 100%;
  padding: 15px 20px;
  white-space: pre-wrap;
  word-wrap: break-word;
  /* we only want overlay text visible */
  /* need to do this so caret still shows up */
  color: inherit;
  -webkit-text-fill-color: transparent;
  ::placeholder {
    color: ${props => props.placeholderColor};
    -webkit-text-fill-color: initial;
  }
`

Input.defaultProps = {
  placeholderColor: '#D7D7D7'
}

export const Overlay = Input.withComponent('div').extend`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  color: inherit;
  /* reversed from Input above */
  -webkit-text-fill-color: initial;
`

export const Inline = styled.span`
  font: inherit;
  line-height: 20px;
`

export const Token = Inline.extend`
  font-weight: 500;
  cursor: pointer;
  pointer-events: auto;
  position: relative;

  ${color}

  &:after {
    content: '';
    background: ${props => props.color};
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

Token.defaultProps = {
  color: '#2384FF'
}
