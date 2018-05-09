const moment = require('moment');

export default function getAge(bdayString) {
  const separatedDates = bdayString.split('.');

  if (separatedDates.length !== 3) return;

  const parsedDates = {
    years: separatedDates[2],
    months: separatedDates[1] - 1,
    days: separatedDates[0],
  };
  const year = moment(parsedDates);

  return moment().diff(year, 'years');
}
