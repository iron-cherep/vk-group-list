import React, { Component } from 'react';
import {
  Snackbar,
  CircularProgress,
} from '@material-ui/core'
import Vk from './components/Vk';
import styled from 'styled-components';

const LoaderWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);  
`;

class App extends Component {
  constructor() {
    super();

    this.state = {
      alertId: 0,
      alerts: [],
      loading: false,
    };
    
    this.setAlert = this.setAlert.bind(this);
    this.setLoader = this.setLoader.bind(this);
  }

  setAlert(alert, time = 5000) {
    const id = this.state.alertId;
    this.setState({
      alertId: id + 1, 
      alerts: [ ...this.state.alerts, { id, alert } ],      
    });

    setTimeout(() => {
      const filteredAlerts = this.state.alerts.filter(alert => alert.id !== id);
      this.setState({ alerts: filteredAlerts });
    }, time);
  }

  setLoader(status) {
    this.setState({ loading: !!status });
  }

  render() {    
    return (
      <section>
        { 
          this.state.alerts && this.state.alerts.map(alert => 
            <Snackbar
              key={alert.id}
              open={true}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}              
              message={alert.alert}
            />
          ) 
        }
        {
          this.state.loading && 
          <LoaderWrapper>
            <CircularProgress />
          </LoaderWrapper>
        }
        <Vk setLoader={this.setLoader} setAlert={this.setAlert} />
      </section>
    );
  }
}

export default App;
