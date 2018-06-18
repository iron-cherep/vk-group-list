import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import StyledPaper from './ui/StyledPaper';
import StyledFormControl from './ui/StyledFormControl';
import GetByGroup from './forms/GetByGroup';
import GetByJob from './forms/GetByJob';

class Form extends Component {
  static propTypes = {
    makeRequest: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      formType: '',
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  render() {
    let formControls;
    switch (this.state.formType) {
      case 'by-group':
        formControls = <GetByGroup makeRequest={this.props.makeRequest} />;
        break;
      case 'by-job':
        formControls = <GetByJob makeRequest={this.props.makeRequest} />;
        break;
      default:
        formControls = null;
    }

    return (
      <StyledPaper>
        <StyledFormControl>
          <InputLabel htmlFor="user-fields">Получить пользователей по:</InputLabel>
          <Select
            id="form-type"
            onChange={this.handleChange}
            name="formType"
            value={this.state.formType}
            open={this.state.open}
            onClose={this.handleClose}
            onOpen={this.handleOpen}
          >
            <MenuItem value="by-group">Участие в сообществе</MenuItem>
            <MenuItem value="by-job">Указанное место работы</MenuItem>
          </Select>
        </StyledFormControl>

        {formControls}
      </StyledPaper>
    );
  }
}

export default Form;
