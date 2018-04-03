import styled, { css } from 'styled-components'
import Textarea from 'react-textarea-autosize'
import clean from 'clean-element'

import {
  style,
  propTypes,

  space,
  width,
  color,
  borders,
  borderColor,
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
  ${borderColor}
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
  fontFamily: 'monospace'
}

const CleanInput = clean(Textarea)

CleanInput.propTypes = {
  placeholderColor: propTypes.color.color,
  ...propTypes.lineHeight,
  ...propTypes.borderRadius
}

const placeholderColor = style({
  prop: 'placeholderColor',
  cssProperty: 'color',
  key: 'colors'
})

export const Input = styled(CleanInput)`
  display: block;
  background: none;
  border: none;
  outline: none;
  resize: none;
  font: inherit;
  width: 100%;
  padding: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  /* we only want overlay text visible */
  /* need to do this so caret still shows up */
  color: inherit;
  -webkit-text-fill-color: transparent;
  ::placeholder {
    ${placeholderColor}
    -webkit-text-fill-color: initial;
  }
`

Input.defaultProps = {
  lineHeight: '1.1rem',
  placeholderColor: '#D7D7D7'
}

export const Overlay = Input.withComponent('div').extend`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  padding: inherit;

  ${props => props.collapsed && css`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  `}

  /* reversed from Input above */
  -webkit-text-fill-color: initial;
`

export const Inline = styled.span`
  font: inherit;
`

const tokenColor = style({
  prop: 'tokenColor',
  cssProperty: 'color',
  key: 'colors'
})

// const tokenUnderline = style({
//   prop: 'tokenColor',
//   cssProperty: 'backgroundColor',
//   key: 'colors'
// })

export const Token = Inline.extend`
  position: relative;
  cursor: pointer;
  font-weight: 500;

  ${tokenColor}

  ${'' /* &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    height: 1px;
    opacity: 0;
    transform: translateY(3px);
    transition: all 150ms;

    ${tokenUnderline}
  } */}
  ${'' /* &:hover:after {
    opacity: 1;
    transform: translateY(0px);
  } */}
`

Token.defaultProps = {
  tokenColor: '#2384FF'
}
