import React, { Component } from 'react';
import api from '../api';
import xls from '../helpers/xls';

import Form from './Form';

class Vk extends Component {
  constructor(props) {
    super(props);

    this.vk = api;
    this.setAlert = this.props.setAlert;
    this.setLoader = this.props.setLoader;
    this.state = {
      apiAuth: false,
    };
    this.setAlert('Подключение к API Вконтакте...');

    this.makeRequest = this.makeRequest.bind(this);
  }

  componentWillMount() {
    this.vk.init()
      .then(() => {
        this.setAlert('Пользователь успешно авторизован!')
        this.setState({ apiAuth: true })
      })
      .catch((e) => {
        console.error(e);
        this.setAlert('Ошибка при авторизации!')
        this.setState({ apiAuth: false });
      });
  }

  makeRequest(groupId, userFields) {
    this.setLoader(true);
    this.vk.request.getGroupList(groupId, userFields)
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
          this.state.apiAuth &&
          <Form makeRequest={this.makeRequest} />
        }
      </section>
    );
  }
}

export default Vk;
