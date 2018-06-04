import React, { Component } from 'react';
import {
  Snackbar,
  CircularProgress,
} from '@material-ui/core';
import styled from 'styled-components';
import xls from './helpers/xls';
import Login from './components/Login';
import Form from './components/Form';

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
      vk: null,
      alertId: 0,
      alerts: [],
      loading: false,
      authStatus: false,
    };

    this.setAlert = this.setAlert.bind(this);
    this.setLoader = this.setLoader.bind(this);
    this.setAuthStatus = this.setAuthStatus.bind(this);
    this.setVkObject = this.setVkObject.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
  }

  setAlert(alert, time = 5000) {
    const id = this.state.alertId;
    this.setState({
      alertId: id + 1,
      alerts: [...this.state.alerts, { id, alert }],
    });

    setTimeout(() => {
      const filteredAlerts = this.state.alerts.filter(item => item.id !== id);
      this.setState({ alerts: filteredAlerts });
    }, time);
  }

  setLoader(status) {
    this.setState({ loading: !!status });
  }

  setAuthStatus(status) {
    this.setState({ authStatus: !!status });
  }

  setVkObject(object) {
    this.setState({ vk: object });
  }

  makeRequest(groupId, userFields) {
    const { vk } = this.state;
    if (!vk) return;

    this.setLoader(true);
    vk.request.getGroupList(groupId, userFields)
      .then((data) => {
        this.setLoader(false);
        xls(data, `Group${groupId}`);
      })
      .catch((e) => {
        console.error(e);
        this.setAlert('Ошибка при выполнении запроса!');
      });
  }

  render() {
    return (
      <section>
        {
          this.state.alerts && this.state.alerts.map(alert => (
            <Snackbar
              open
              key={alert.id}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              message={alert.alert}
            />
          ))
        }
        {
          this.state.loading &&
          <LoaderWrapper>
            <CircularProgress />
          </LoaderWrapper>
        }
        {
          this.state.authStatus
            ? <Form makeRequest={this.makeRequest} />
            : <Login
              setAlert={this.setAlert}
              setAuthStatus={this.setAuthStatus}
              setVkObject={this.setVkObject}
            />
        }
      </section>
    );
  }
}

export default App;
