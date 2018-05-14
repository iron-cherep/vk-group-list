import React, { Component } from 'react';
import api from '../api';
import xls from '../helpers/xls';

class Vk extends Component {
  constructor(props) {
    super(props);

    this.vk = api;
    this.state = {
      apiStatus: { auth: false, status: 'Подключение к API Вконтакте...' },
      loading: false,
    };

    this.makeRequest = this.makeRequest.bind(this);
  }

  componentWillMount() {
    this.vk.init()
      .then(() => this.setState({ apiStatus: { auth: true, status: 'Пользователь успешно авторизован!' } }))
      .catch((e) => {
        console.error(e);
        this.setState({ apiStatus: { auth: false, status: 'Ошибка авторизации!' } });
      });
  }

  makeRequest() {
    this.setState({ loading: true });
    this.vk.request.getGroupList(2176573, ['bdate', 'city', 'photo_50', 'domain', 'education', 'career'])
      .then((data) => {
        this.setState({ loading: false });
        xls(data, `Group${2176573}.xlsx`);
      })
      .catch(console.error);
  }

  render() {
    return (
      <section>
        <div>{this.state.apiStatus.status}</div>
        <div>{this.state.loading && 'Загрузка...'}</div>
        {(this.state.apiStatus.auth) && <button onClick={this.makeRequest}>Получить данные</button>}
      </section>
    );
  }
}

export default Vk;
