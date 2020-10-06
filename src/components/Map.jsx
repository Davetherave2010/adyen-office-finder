import React from 'react'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import getMapDot from './pulsingDot'

export default class Map extends React.Component {
  flyTo = (latitude, longitude, zoom = 9) => {
    this.map.flyTo({
      center: [
        longitude,
        latitude
      ],
      zoom,
      essential: true
    })
  }

  showCurrentLocation = (latitude, longitude) => {
    this.flyTo(latitude, longitude)

    const pulsingDot = getMapDot(this.map)

    this.map.addImage('pulsing-dot', pulsingDot, { pixelRatio: 2 })

    this.map.addSource('points', {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [
                longitude,
                latitude
              ]
            }
          }
        ]
      }
    })
    this.map.addLayer({
      'id': 'points',
      'type': 'symbol',
      'source': 'points',
      'layout': {
        'icon-image': 'pulsing-dot'
      }
    })
  }

  addOfficeLocationMarkers = () => {
    const { offices } = this.props

    offices.forEach(office => {
      new mapboxgl.Marker()
        .setLngLat([office.longitude, office.latitude])
        .addTo(this.map)
    })
  }
  componentDidMount() {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      attributionControl: false
    })

    this.addOfficeLocationMarkers()
  }

  render() {
    return (
      <div id="map"></div>
    )
  }
}