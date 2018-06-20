import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@material-ui/core';
import StyledPaper from './ui/StyledPaper';
import StyledFormControl from './ui/StyledFormControl';
import GetByGroup from './forms/GetByGroup';
import GetByJob from './forms/GetByJob';
import UserFields from './forms/partials/UserFields';
import * as requestTypes from '../constants/request-types';

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formType: '',
      userFields: [],
      formTypeOpen: false,
      userFieldsOpen: false,
    };

    this.setGlobalFormState = this.setGlobalFormState.bind(this);
  }

  getGlobalFormState = () => this.state;

  setGlobalFormState = (state) => {
    this.setState(state);
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleClose = (name) => {
    this.setState({ [`${name}Open`]: false });
  };

  handleOpen = (name) => {
    this.setState({ [`${name}Open`]: true });
  };

  handleSubmit = () => {
    let requestParams;
    switch (this.state.formType) {
      case requestTypes.GET_BY_GROUP: {
        requestParams = { groupId: this.state.groupId };
        break;
      }
      case requestTypes.GET_BY_JOB: {
        requestParams = { searchStrings: this.state.searchStrings };
        break;
      }
      default:
        requestParams = {};
    }

    const { formType, userFields } = this.state;

    this.props.makeRequest(formType, userFields, requestParams);
  }

  render() {
    let formControls;
    switch (this.state.formType) {
      case requestTypes.GET_BY_GROUP:
        formControls = (
          <GetByGroup
            handleChange={this.handleChange}
          />
        );
        break;
      case requestTypes.GET_BY_JOB:
        formControls = (
          <GetByJob
            getGlobalFormState={this.getGlobalFormState}
            setGlobalFormState={this.setGlobalFormState}
            handleChange={this.handleChange}
          />
        );
        break;
      default:
        formControls = null;
    }

    return (
      <StyledPaper>
        <StyledFormControl>
          <InputLabel htmlFor="form-type">Получить пользователей по:</InputLabel>
          <Select
            id="form-type"
            onChange={this.handleChange}
            name="formType"
            value={this.state.formType}
            open={this.state.formTypeOpen}
            onClose={() => this.handleClose('formType')}
            onOpen={() => this.handleOpen('formType')}
          >
            <MenuItem value={requestTypes.GET_BY_GROUP}>Участие в сообществе</MenuItem>
            <MenuItem value={requestTypes.GET_BY_JOB}>Указанное место работы</MenuItem>
          </Select>
        </StyledFormControl>

        <UserFields
          handleChange={this.handleChange}
          handleClose={this.handleClose}
          handleOpen={this.handleOpen}
          userFieldsOpen={this.state.userFieldsOpen}
          userFields={this.state.userFields}
        />

        {formControls}

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
