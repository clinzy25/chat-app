// module.exports = {
//   env: {
//     browser: true,
//     es2021: true,
//   },
//   extends: ['eslint:recommended', 'plugin:react/recommended'],
//   overrides: [],
//   parserOptions: {
//     requireConfigFile: false,
//     ecmaVersion: 'latest',
//     sourceType: 'module',
//   },
//   plugins: ['react'],
//   rules: {
//     'react-hooks/exhaustive-deps': 0,
//   },
// }

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  overrides: [
    {
      files: ['client/*.js'],
      rules: {
        'react-hooks/exhaustive-deps': 0,
      },
    },
  ],
  rules: {
    'linebreak-style': 0,
    'comma-dangle': 0,
    'jsx-quotes': 0,
    'react/jsx-fragments': 0,
    'import/no-extraneous-dependencies': 0,
    camelcase: 0,
    'no-console': 0,
    'no-underscore-dangle': 0,
    'react/prop-types': 0,
    'react-hooks/exhaustive-deps': 0,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
