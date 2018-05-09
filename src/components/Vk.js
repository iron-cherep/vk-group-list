import React, { Component } from 'react';
import Api from '../api';

class Vk extends Component {
  constructor(props) {
    super(props);

    this.api = new Api();
    this.state = {
      apiStatus: [false, 'Подключение к API Вконтакте...'],
      loading: false,
    };

    this.makeRequest = this.makeRequest.bind(this);
  }

  componentWillMount() {
    this.api.init()
      .then(status => this.setState({ apiStatus: status }))
      .catch(console.log);
  }

  makeRequest() {
    this.setState({ loading: true });
    this.api.getGroupList(2176573)
      .then(() => this.setState({ loading: false }))
      .catch(console.log());
  }

  render() {
    return (
      <section>
        <div>{this.state.apiStatus[1]}</div>
        <div>{this.state.loading && 'Загрузка...'}</div>
        {(this.state.apiStatus[0]) && <button onClick={this.makeRequest}>Получить данные</button>}
      </section>
    );
  }
}

export default Vk;
