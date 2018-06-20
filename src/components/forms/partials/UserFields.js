import React from 'react';
import PropTypes from 'prop-types';

import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import StyledFormControl from '../../ui/StyledFormControl';
import { USER_FIELDS } from '../../../constants/API';

const UserFields = props => (
  <StyledFormControl>
    <InputLabel htmlFor="user-fields">Информация о пользователе</InputLabel>
    <Select
      multiple
      id="user-fields"
      onChange={props.handleChange}
      name="userFields"
      value={props.userFields}
      open={props.userFieldsOpen}
      onClose={() => props.handleClose('userFields')}
      onOpen={() => props.handleOpen('userFields')}
    >
      {USER_FIELDS.map(field => (
        <MenuItem value={field[0]} key={field[0]}>{field[1]}</MenuItem>
      ))}
    </Select>
  </StyledFormControl>
);

UserFields.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleOpen: PropTypes.func.isRequired,
  userFieldsOpen: PropTypes.bool.isRequired,
  userFields: PropTypes.array.isRequired,
};

export default UserFields;
