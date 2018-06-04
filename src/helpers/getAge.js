import moment from 'moment';

export default function getAge(bdayString) {
  const separatedDates = bdayString.split('.');

  if (separatedDates.length !== 3) return null;

  const parsedDates = {
    years: separatedDates[2],
    months: separatedDates[1] - 1,
    days: separatedDates[0],
  };
  const year = moment(parsedDates);
  const age = moment().diff(year, 'years');

  return age;
}
