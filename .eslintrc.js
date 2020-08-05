module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'linebreak-style': 'off',
    'object-curly-newline': 'off',
    'no-console': 'off',
    'consistent-return': 'off',
    'no-underscore-dangle': 'off',
  },
};
