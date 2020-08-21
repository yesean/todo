const palindrome = (string) => {
  return string.split('').reverse().join('');
};

const average = (array) => {
  return array.length && array.reduce((sum, item) => sum + item) / array.length;
};

module.exports = { palindrome, average };
