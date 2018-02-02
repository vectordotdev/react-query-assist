import React from 'react'
import styled, { keyframes } from 'styled-components'

const scaleOut = keyframes`
  0% {
    opacity: 1;
    transform: scale(0);
  }
  100% {
    opacity: 0;
    transform: scale(1.0);
  }
`

const Spinner = styled.div`
  background: #6554AF;
  border-radius: 100%;
  width: 40px;
  height: 40px;
  margin: 20px auto;
  animation: ${scaleOut} 1.0s infinite ease-in-out;
`

export default function (props) {
  return <Spinner />
}
