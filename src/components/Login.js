import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import api from '../api';
import StyledPaper from './ui/StyledPaper';
import StyledFormControl from './ui/StyledFormControl';

class Login extends Component {
  constructor(props) {
    super(props);

    this.setAlert = this.props.setAlert;
    this.setAuthStatus = this.props.setAuthStatus;
    this.setVkObject = this.props.setVkObject;
  }

  handleAuth() {
    api.init()
      .then(() => {
        this.setVkObject(api);
        this.setAlert('Пользователь успешно авторизован!');
        this.setAuthStatus(true);
      })
      .catch((e) => {
        console.error(e);
        this.setAlert('Ошибка при авторизации!');
        this.setAuthStatus(false);
      });
  }

  render() {
    return (
      <StyledPaper>
        <p>Для работы приложению нужен доступ к публичной части вашего профиля</p>
        <StyledFormControl>
          <Button variant="raised" color="primary" onClick={() => this.handleAuth()}>Предоставить доступ</Button>
        </StyledFormControl>
      </StyledPaper>
    );
  }
}

Login.propTypes = {
  setAlert: PropTypes.func.isRequired,
  setAuthStatus: PropTypes.func.isRequired,
  setVkObject: PropTypes.func.isRequired,
};

export default Login;
