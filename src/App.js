import React from 'react';
import logo from './logo.svg';
import './App.css';
import Vk from './components/Vk';

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
    </header>
    <Vk />
  </div>
);

export default App;
