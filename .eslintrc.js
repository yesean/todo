module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
  },
  extends: ['airbnb-base', 'eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 11,
  },
  plugins: ['import', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
