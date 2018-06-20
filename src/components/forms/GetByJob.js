import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Input,
  InputLabel,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import SearchStringsTable from './partials/SearchStringsTable';
import StyledFormControl from '../ui/StyledFormControl';

class GetByJob extends Component {
  constructor(props) {
    super(props);

    this.getGlobalFormState = this.props.getGlobalFormState;
    this.setGlobalFormState = this.props.setGlobalFormState;

    this.setGlobalFormState({ searchStrings: [] });
    this.state = {
      currentSearchString: '',
      localSearchStrings: [], // @TODO убрать дублирующий state
    };
  }

  handleKeypress = (e) => {
    if (e.key !== 'Enter') return;
    this.addString();
  };

  addString = () => {
    const string = this.state.currentSearchString;
    const { searchStrings } = this.getGlobalFormState();

    if (string === '' || searchStrings.indexOf(string) !== -1) return;

    this.setGlobalFormState({
      searchStrings: [...searchStrings, string],
    });
    this.setState({
      currentSearchString: '',
      localSearchStrings: [...searchStrings, string],
    });
  };

  deleteString = (string) => {
    const { searchStrings } = this.getGlobalFormState();
    const filteredStrings = searchStrings.filter(item => item !== string);

    this.setGlobalFormState({ searchStrings: filteredStrings });
    this.setState({ localSearchStrings: filteredStrings });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const searchStrings = this.state.localSearchStrings;
    const haveSearchStrings = (searchStrings && searchStrings.length > 0);

    return (
      <Fragment>
        <StyledFormControl>
          <InputLabel htmlFor="current-search-string">Строка поиска</InputLabel>
          <Input
            id="current-search-string"
            name="currentSearchString"
            value={this.state.currentSearchString}
            onChange={this.handleChange}
            onKeyPress={this.handleKeypress}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="Добавить строку"
                  onClick={this.addString}
                >
                  <AddIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </StyledFormControl>

        {haveSearchStrings &&
        <SearchStringsTable
          deleteString={this.deleteString}
          searchStrings={this.state.localSearchStrings}
        />
        }
      </Fragment>
    );
  }
}

GetByJob.propTypes = {
  getGlobalFormState: PropTypes.func.isRequired,
  setGlobalFormState: PropTypes.func.isRequired,
};

export default GetByJob;
