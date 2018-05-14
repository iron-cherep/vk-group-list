const XLSX = require('xlsx');

const XLSfromJSON = (data, filename) => {
  const book = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(book, sheet);

  XLSX.writeFile(book, `${filename}.xlsb`);
};

export default XLSfromJSON;
