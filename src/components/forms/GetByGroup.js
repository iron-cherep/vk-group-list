import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  InputLabel,
  Input,
  Select,
  Button,
  MenuItem,
} from '@material-ui/core';
import StyledFormControl from '../ui/StyledFormControl';
import { USER_FIELDS } from '../../constants/API';

class GetByGroup extends Component {
  static propTypes = {
    makeRequest: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.makeRequest = this.props.makeRequest;
    this.userFieldsAvailable = USER_FIELDS;

    this.state = {
      groupId: null,
      userFields: [],
      selectOpen: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = () => {
    this.makeRequest(this.state.groupId, this.state.userFields);
  };

  handleClose = () => {
    this.setState({ selectOpen: false });
  };

  handleOpen = () => {
    this.setState({ selectOpen: true });
  };

  render() {
    return (
      <Fragment>
        <StyledFormControl>
          <InputLabel htmlFor="group-id">ID группы</InputLabel>
          <Input id="group-id" onChange={this.handleChange} name="groupId" />
        </StyledFormControl>

        <StyledFormControl>
          <InputLabel htmlFor="user-fields">Информация</InputLabel>
          <Select
            multiple
            id="user-fields"
            onChange={this.handleChange}
            name="userFields"
            value={this.state.userFields}
            open={this.state.selectOpen}
            onClose={this.handleClose}
            onOpen={this.handleOpen}
          >
            {this.userFieldsAvailable.map(field => (
              <MenuItem value={field[0]} key={field[0]}>{field[1]}</MenuItem>
            ))}
          </Select>
        </StyledFormControl>

        <StyledFormControl>
          <Button variant="raised" color="primary" onClick={this.handleSubmit}>Получить данные</Button>
        </StyledFormControl>
      </Fragment>
    );
  }
}

export default GetByGroup;
