import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import DeleteIcon from '@material-ui/icons/Delete';

const SearchStringsTable = ({ deleteString, searchStrings }) => (
  <Table>
    <TableBody>
      {searchStrings.map(string => (
        <TableRow key={string}>
          <TableCell>{string}</TableCell>
          <TableCell width="20px">
            <IconButton onClick={() => deleteString(string)}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

SearchStringsTable.propTypes = {
  deleteString: PropTypes.func.isRequired,
  searchStrings: PropTypes.array.isRequired,
};

export default SearchStringsTable;
