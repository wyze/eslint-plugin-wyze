/* eslint-disable global-require */
module.exports = {
  rules: {
    'func-params-spacing': require('./lib/rules/func-params-spacing'),
    'max-file-length': require('./lib/rules/max-file-length'),
    'newline-after-export': require('./lib/rules/newline-after-export'),
    'sort-destructuring-keys': require('./lib/rules/sort-destructuring-keys'),
    'sort-imports': require('./lib/rules/sort-imports'),
    'space-around-conditional': require('./lib/rules/space-around-conditional'),
  },
  configs: {
    recommended: {
      rules: {
        'wyze/func-params-spacing': 'error',
        'wyze/max-file-length': 'error',
        'wyze/newline-after-export': 'error',
        'wyze/sort-destructuring-keys': 'error',
        'wyze/sort-imports': 'error',
        'wyze/space-around-conditional': 'error',
      },
    },
  },
}
