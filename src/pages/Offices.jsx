import React from 'react';
import {
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import OfficeSelector from '../components/OfficeSelector';

import Office from './Office'


class Offices extends React.Component{
  render() {
    const { path } = this.props.match;
    const { offices, position, history, map } = this.props
    return (
      <div>
        <Switch>
          <Route path={`${path}/:officeName`}>
            <Office map={map} position={position} offices={offices} />
          </Route>
          <Route path={path}>
            <h1>Please select an Office.</h1>
            <OfficeSelector offices={offices} onButtonClick={(value) => history.push(`/offices/${value}`)} />
          </Route>
        </Switch>
      </div>
    );
  }
}


export default withRouter(Offices);