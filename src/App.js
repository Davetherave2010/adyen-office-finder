import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Home from './pages/Home'
import Offices from './pages/Offices'

import Map from './components/Map'

class App extends React.Component{
  constructor(props) {
    super(props)

    this.map = React.createRef();
    this.state = {
      position: null,
      offices: [
        {
          name: 'Amsterdam',
          latitude: 52.376510,
          longitude: 4.905960,
          closestAirport: 'AMS',
          distance: null,
          weatherKey: 249758
        },
        {
          name: 'Madrid',
          latitude: 40.435570,
          longitude: -3.689590,
          closestAirport: 'MAD',
          distance: null,
          weatherKey: 308526
        },
        {
          name: 'Bucharest',
          latitude: 44.426765,
          longitude: 26.102537,
          closestAirport: 'OTP',
          distance: null,
          weatherKey: 287430
        }
      ]
    }
  }
  render() {
    const { offices, position } = this.state

    return (
      <Router>
        <div className="App">
          <Map ref={this.map} offices={offices} />
          <Switch>
            <Route path="/offices">
              <Offices map={this.map} offices={offices} position={position}/>
            </Route>
            <Route path="/">
              <Home
                map={this.map}
                offices={offices}
                setOffices={(to) => this.setState({offices: to})}
                position={position}
                setPosition={(pos) => this.setState({ position: pos })} />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
