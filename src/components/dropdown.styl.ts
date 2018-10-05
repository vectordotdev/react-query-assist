import styled, { keyframes } from "react-emotion";

import {
  borderColor,
  borderRadius,
  borders,
  boxShadow,
  color,
  fontFamily,
  fontSize,
  fontWeight,
  left,
  letterSpacing,
  lineHeight,
  maxHeight,
  maxWidth,
  minWidth,
  space,
  top,
  width,
} from "styled-system";

export const swingDown = keyframes`
  0% {
    opacity: 0;
    transform: perspective(50em) rotateX(-30deg);
  }
  100% {
    opacity: 1;
    transform: perspective(50em) rotateX(0deg);
  }
`;

export const Container = styled("aside")`
  display: inline-block;
  position: absolute;
  z-index: 10;
  transform-origin: 50% 0;
  animation: ${swingDown} ease-in-out 250ms;
  transition: top 100ms, left 100ms;

  ${top}
  ${left}
  ${color}
  ${boxShadow}
  ${borders}
  ${borderColor}
  ${borderRadius}
  ${space}
  ${width}
  ${minWidth}
  ${fontSize}
  ${fontWeight}
  ${fontFamily}
  ${lineHeight}
  ${letterSpacing}
`;

Container.defaultProps = {
  bg: "#555555",
  boxShadow: "0 4px 10px rgba(0, 0, 0, .25)",
  color: "#FFFFFF",
  minWidth: "280px",
};

export const Section = styled("section")`
  padding: 15px;
  text-align: ${(props) => props.center ? "center" : "inherit"};
  :not(:last-child) {
    border-bottom: 1px solid rgba(255, 255, 255, .15);
  }
`;

export const Suggestions = styled("ul")`
  list-style-type: none;
  line-height: 20px;
  margin: 10px 0;
  overflow: auto;

  ${space}
  ${color}
  ${borders}
  ${maxHeight}
`;

Suggestions.defaultProps = {
  maxHeight: "200px",
};

export const Suggestion = styled("li")`
  cursor: pointer;
  border: 1px solid transparent;
  overflow: hidden;
  text-overflow: ellipsis;

  ${space}
  ${maxWidth}

  ${(props) => props.active && color}
  ${(props) => props.active && borders}
  ${(props) => props.active && borderColor}
`;

Suggestion.defaultProps = {
  bg: "#FFFFFF",
  color: "#000000",
  p: "3px 15px",
  maxWidth: "320px",
};

export const Operators = styled(Section)`
  padding: 15px 0;
`;

export const Operator = styled("div")`
  display: inline-block;
  background: ${(props) => props.active ? "rgba(255, 255, 255, 0.2)" : "none"};
  font-weight: 500;
  line-height: 18px;
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const OperatorLone = styled(Operator)`
  display: block;
  margin-bottom: 5px;
`;

export const Key = styled("div")`
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  min-width: 20px;
  text-align: center;
  vertical-align: middle;
  padding: 2px 5px;
  margin-right: 5px;
`;

export const KeyOutline = styled(Key)`
  background: none;
  border: 1px solid ${(props) => props.theme.color};
  color: ${(props) => props.theme.color};
  font-size: 8px;
  padding: 0;
  width: ${(props) => props.long ? "36px" : "18px"};
  height: 18px;
`;

export const Helper = styled("div")`
  display: inline-block;
  opacity: 0.5;
  &:not(:last-child) {
    margin-right: 15px;
  }
`;
