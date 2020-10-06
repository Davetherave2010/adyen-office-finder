import React from 'react'

export default class OfficeSelector extends React.Component{
  constructor(props) {
    super(props)
    this.otherOfficeSelector = React.createRef()
  }

  render() {
    const { onButtonClick, offices } = this.props
    return (
      <>
        <select ref={this.otherOfficeSelector}>
          {offices.map(office => (
            <option key={office.name} value={office.name.toLowerCase()}>{office.name}</option>
          ))}
        </select>
        <button onClick={() => onButtonClick(this.otherOfficeSelector.current.value)}>Go</button>
      </>
    )
  }
}