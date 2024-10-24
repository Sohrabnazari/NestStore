module.exports = {
  // "*.{png,jpeg,jpg,gif,svg}": "",
  '*.{md,html}': 'prettier --write --ignore-unknown',
  '*.{css,scss}': ['stylelint --fix', 'prettier --write --ignore-unknown'],
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write --ignore-unknown'],
};
