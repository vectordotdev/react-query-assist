import React from 'react'
import styled from 'styled-components'

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
    <Button
      target='_blank'
      {...props} />
  )
}
