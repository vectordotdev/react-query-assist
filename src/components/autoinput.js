import React, { Component } from 'react'
import AutosizedInput from 'react-input-autosize'

export default class extends Component {
  render () {
    const {
      className,
      inputRef,
      ...rest
    } = this.props

    return (
      <AutosizedInput {...rest}
        inputRef={inputRef}
        inputClassName={className} />
    )
  }
}
