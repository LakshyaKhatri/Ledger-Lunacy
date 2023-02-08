/**
 * reads the json file on the provided path and returns it as JS object
 * @param {String} file 
 * @returns {Object} a JS object representing the read json
 */
async function readJSONFile(file) {
  const response = await fetch(file);
  return await response.json();
}

/**
 * @param {String} sentence -- string to be titleized
 * @returns {String} titleized sentence
 */
function titleize(sentence) {
  return sentence.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

/**
 * @param {Date} date -- the date object to be formatted
 * @returns {String} date string in DD/MM/YY format
 */
function getFormattedDate(date) {
  let month = date.getMonth() + 1; // months are 0 indexed
  let day = date.getDate();
  let year = date.getFullYear();

  day = day.toString().padStart(2, 0);
  month = month.toString().padStart(2, 0);
  year = year.toString().substring(2).padStart(2, 0);

  // date in reference screenshot is in MM/DD/YY format instead
  return `${day}/${month}/${year}`;
}

/**
 * 
 * @param {Number} amount 
 * @returns {String} amount with $ as prefix 
 */
function getFormattedCurrency(amount) {
  return (amount >= 0 ? `$${Math.abs(amount)}` : `-$${Math.abs(amount)}`);
}
