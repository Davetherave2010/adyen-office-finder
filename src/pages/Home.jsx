import React from 'react'
import Map from '../components/Map'

export default class Home extends React.Component{
  constructor(props) {
    super(props)

    this.map = React.createRef();
    this.state = {
      status: null,
      position: null,
      offices: [
        {
          name: 'Amsterdam',
          lat: 52.376510,
          long: 4.905960
        },
        {
          name: 'Madrid',
          lat: 40.435570,
          long: -3.689590
        },
        {
          name: 'Bucharest',
          lat: 44.426765,
          long: 26.102537
        }
      ]
    }
  }

  shareLocation = () => {
    if (!navigator.geolocation) {
      return this.setState({ status: 'Geolocation is not supported by your browser' })
    }

    this.setState({ status: 'locating' })
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({ 
          status: 'found',
          position: position.coords
        })

        this.map.current.showCurrentLocation(this.state.position.latitude, this.state.position.longitude)
      },
      (err) => this.setState({ status: 'error' }))
  }

  render () {
    const { status, offices } = this.state
    return (
      <>
        <Map ref={this.map} offices={offices}/>
        <h1>Welcome to Adyen Office Finder</h1>
        <p>Share your location to find your closest office or select an office from the list</p>
        {status ? <p>{status}</p> : null} 
        <button onClick={this.shareLocation}>
          Share my location
      </button>

        <select>
          {offices.map(office => (
            <option key={office.name}>{office.name}</option>
          ))}
        </select>
      </>
    )
  }
}

