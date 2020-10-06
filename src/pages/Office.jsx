import React from 'react';
import {
  withRouter
} from "react-router-dom";
import { format, startOfTomorrow } from 'date-fns'
import OfficeSelector from '../components/OfficeSelector';


class Office extends React.Component{
  constructor(props) {
    super(props)

    this.state = {
      closestAirport: null,
      findingFlights: false,
      attemptedToFindFlights: false,
      flights: [],
      currentWeather: null
    }
  }

  findClosestAirport = async () => {
    const { latitude, longitude } = this.props.position

    const airportsResponse = await fetch(`https://api.skypicker.com/locations?type=radius&lat=${latitude}&lon=${longitude}&radius=200&locale=en-US&location_types=airport&limit=20&active_only=true`)
    const airports = await airportsResponse.json()

    return airports.locations[0]
  }

  findFlights = async (fromAirportCode, toAirportCode) => {
    const date = format(startOfTomorrow(), 'dd/MM/yyyy')

    this.setState({
      attemptedToFindFlights: false,
      findingFlights: true
    })

    const flightsResponse = await fetch(`https://api.skypicker.com/flights?fly_from=${fromAirportCode}&fly_to=${toAirportCode}&date_from=${date}&date_to=${date}&sort=price&asc=1&locale=en&partner=picky&direct_flights=1`)
    const flights = await flightsResponse.json()

    this.setState({ 
      findingFlights: false,
      attemptedToFindFlights: true
    })

    return flights
  }

  showFlights = async (from) => {
    const { match } = this.props
    const { officeName } = match.params;

    const flights = await this.findFlights(from, this.getAirportId(officeName))
  
    this.setState({
      flights
    })
  }

  getAirportId = (location) => {
    const { offices } = this.props

    const selectedOffice = offices.find(office => office.name.toLowerCase() === location.toLowerCase())
    return selectedOffice.closestAirport
  }

  getCurrentWeather = async () => {
    const selectedOffice = this.getSelectedLocation()
    const weatherResponse = await fetch(`https://dataservice.accuweather.com/currentconditions/v1/${selectedOffice.weatherKey}?apikey=${process.env.REACT_APP_ACCUWEATHER_TOKEN}`)
    const weather = await weatherResponse.json()

    this.setState({
      currentWeather: weather[0]
    })

  }

  getSelectedLocation = () => {
    const { match, offices } = this.props
    const { officeName } = match.params;

    return offices.find(office => office.name.toLowerCase() === officeName.toLowerCase())
  }
  
  async componentDidMount() {
    const { position, map } = this.props

    const selectedOffice = this.getSelectedLocation()

    map.current.flyTo(
      selectedOffice.latitude,
      selectedOffice.longitude,
      14
    )

    this.getCurrentWeather()

    if (position) {
      const closestAirport = await this.findClosestAirport()
      
      this.showFlights(closestAirport.id)

      this.setState({
        closestAirport
      })
    }
  }

  getWeatherEmoji = () => {
    const { currentWeather } = this.state

    if (!currentWeather) return null

    switch (currentWeather.WeatherText) {
      case 'Rain':
        return <span role="img" aria-label="Raining">🌧</span>
      case 'Cloudy':
        return <span role="img" aria-label="Cloudy">⛅️</span>
      case 'Sunny':
        return <span role="img" aria-label="Sunny">☀️</span>
      default:
        return <span role="img" aria-label="Shrug">🤷‍♂️</span>
    }
  }

  getCurrentTemperature = () => {
    const { currentWeather } = this.state

    if (!currentWeather) return null

    return `${currentWeather.Temperature.Metric.Value}`
  }

  render() {
    const { offices, position, match } = this.props
    const { officeName } = match.params;
    const { attemptedToFindFlights, flights, findingFlights } = this.state
    const hasNoFlights = !flights.data || flights.data.length === 0
  
    return (
      <>
        <h3 className="title-case">{officeName}</h3>
        <p>Current weather: {this.getCurrentTemperature()}&#8451; {this.getWeatherEmoji()} </p>

        {!position && <div>
          <h2>To find flights, tell us where are you coming from?</h2>
          <OfficeSelector offices={offices} onButtonClick={(value) => this.showFlights(this.getAirportId(value))} />
        </div>}
        {findingFlights && <div className="spinner"></div>}
        { attemptedToFindFlights && hasNoFlights && <p>We couldn't find any flights to this office. Bummer</p>}
        { !hasNoFlights && flights.data && <div>
          <p>OMG we found <strong>{flights.data.length}</strong> flights to {officeName} taking off tomorrow</p>
          {flights.data.map(flight =>
            <div className="flight-result" key={flight.id}>
              <div><strong>{flight.cityCodeFrom}</strong> to <strong>{flight.cityCodeTo}</strong></div>
              <span>Taking {flight.fly_duration} </span><span>Costs €{flight.price}</span>
            </div>
          )}
        </div>}
      </>
    )
  }
}

export default withRouter(Office);