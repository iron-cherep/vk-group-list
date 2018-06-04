import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  InputLabel,
  Input,
  Select,
  Button,
} from '@material-ui/core';
import StyledPaper from './ui/StyledPaper';
import StyledFormControl from './ui/StyledFormControl';
import { USER_FIELDS } from '../constants/API';

class Form extends Component {
  constructor(props) {
    super(props);

    this.makeRequest = this.props.makeRequest;
    this.userFieldsAvailable = USER_FIELDS;

    this.state = {
      groupId: null,
      userFields: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit() {
    this.makeRequest(this.state.groupId, this.state.userFields);
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <StyledPaper>
        <StyledFormControl>
          <InputLabel htmlFor="group-id">ID группы</InputLabel>
          <Input id="group-id" onChange={this.handleChange} name="groupId" />
        </StyledFormControl>

        <StyledFormControl>
          <InputLabel htmlFor="user-fields">Информация</InputLabel>
          <Select id="user-fields" onChange={this.handleChange} name="userFields" multiple value={this.state.userFields}>
            {this.userFieldsAvailable.map(field => (
              <option value={field[0]} key={field[0]}>{field[1]}</option>
            ))}
          </Select>
        </StyledFormControl>

        <StyledFormControl>
          <Button variant="raised" color="primary" onClick={this.handleSubmit}>Получить данные</Button>
        </StyledFormControl>
      </StyledPaper>
    );
  }
}

Form.propTypes = {
  makeRequest: PropTypes.func.isRequired,
};

export default Form;
