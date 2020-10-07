import React from 'react'
import {
  withRouter,
  Link
} from "react-router-dom";

import * as turf from '@turf/turf'
import OfficeSelector from '../components/OfficeSelector'


class Home extends React.Component{
  constructor(props) {
    super(props)

    this.otherOfficeSelector = React.createRef();
    this.state = {
      status: null
    }
  }

  measureDistance = (from, to) => {
    const fromPoint = turf.point([from.longitude, from.latitude]);
    const toPoint = turf.point([to.longitude, to.latitude]);
    const options = { units: 'kilometers' };
    const distance = Math.round(turf.distance(fromPoint, toPoint, options))

    return distance;
  }

  shareLocation = () => {
    if (!navigator.geolocation) {
      return this.setState({ status: 'Geolocation is not supported by your browser' })
    }

    this.setState({ status: 'locating' })
    navigator.geolocation.getCurrentPosition(
      async (location) => {
        const { map, offices, setOffices, setPosition } = this.props
        const { latitude, longitude } = location.coords

        this.setState({ 
          status: 'found',
        })

        setPosition(location.coords)

        map.current.showCurrentLocation(latitude, longitude)

        const updatedOffices = offices.map(office => {
          return {
            ...office,
            distance: this.measureDistance(location.coords, office)
          }
        })

        setOffices(updatedOffices)
      },
      (err) => this.setState({ status: 'error' }))
  }
  
  render () {
    const { status } = this.state
    const { offices, position, history } = this.props
    const sortedOffices = offices.sort((a, b) => {
      if (a.distance <= b.distance) return -1
      if (a.distance === b.distance) return 0
      return 1
    })

    return (
      <>
        <h1>Welcome to Adyen Office Finder</h1>

        {status !== 'found' && <div>
          <p>Share your location to find your closest office or select an office from the list</p>
          {status && <p>{status}</p>}
          {!position && <button className="share-location-button" onClick={this.shareLocation}>
            Share my location
          </button>}
          <div>
            <OfficeSelector offices={offices} onButtonClick={(value) => history.push(`/offices/${value}`)} />
          </div>
        </div>}

        {status === 'found' && <div>
          <h2>Your closest office is <Link to={`/offices/${sortedOffices[0].name}`}>{sortedOffices[0].name}</Link></h2>

          <p>Or you can checkout other offices</p>

          <OfficeSelector offices={sortedOffices.slice(1)} onButtonClick={(value) => history.push(`/offices/${value}`)} />
        </div>}
      </>
    )
  }
}

export default withRouter(Home)
