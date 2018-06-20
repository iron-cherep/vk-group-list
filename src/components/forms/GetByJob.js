import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Input,
  InputLabel,
  Button,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import StyledFormControl from '../ui/StyledFormControl';

class GetByJob extends Component {
  static propTypes = {
    makeRequest: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      currentSearchString: '',
      searchStrings: [],
    };

    this.makeRequest = this.props.makeRequest;
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleKeypress = (e) => {
    if (e.key !== 'Enter') return;
    this.addString();
  };

  addString = () => {
    const string = this.state.currentSearchString;
    const { searchStrings } = this.state;

    if (string === '' || searchStrings.indexOf(string) !== -1) return;

    this.setState({
      searchStrings: [...searchStrings, string],
      currentSearchString: '',
    });
  };

  deleteString = (string) => {
    const { searchStrings } = this.state;
    const filteredStrings = searchStrings.filter(item => item !== string);

    this.setState({ searchStrings: filteredStrings });
  };

  handleSubmit = () => {
    this.makeRequest(this.state.groupId, this.state.userFields);
  };

  render() {
    const haveSearchStrings = this.state.searchStrings.length > 0;

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
          />
        </StyledFormControl>

        <StyledFormControl>
          <Button variant="raised" color="primary" onClick={this.addString}>Добавить</Button>
        </StyledFormControl>

        {haveSearchStrings &&
          <StyledFormControl>
            <Button variant="raised" color="primary" onClick={this.handleSubmit}>Начать поиск</Button>
          </StyledFormControl>
        }

        {haveSearchStrings &&
          <Table>
            <TableBody>
              {this.state.searchStrings.map(string => (
                <TableRow key={string}>
                  <TableCell>{string}</TableCell>
                  <TableCell width="20px">
                    <IconButton onClick={() => this.deleteString(string)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }
      </Fragment>
    );
  }
}

export default GetByJob;
