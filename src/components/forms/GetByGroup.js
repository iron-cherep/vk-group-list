import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  InputLabel,
  Input,
} from '@material-ui/core';
import StyledFormControl from '../ui/StyledFormControl';

const GetByGroup = ({ handleChange }) => (
  <Fragment>
    <StyledFormControl>
      <InputLabel htmlFor="group-id">ID группы</InputLabel>
      <Input id="group-id" onChange={handleChange} name="groupId" />
    </StyledFormControl>
  </Fragment>
);

GetByGroup.propTypes = {
  handleChange: PropTypes.func.isRequired,
};

export default GetByGroup;
