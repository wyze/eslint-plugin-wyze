module.exports = {
  rules: {
    'max-file-length': require('./lib/rules/max-file-length'),
    'sort-imports': require('./lib/rules/sort-imports'),
    'space-around-conditional': require('./lib/rules/space-around-conditional')
  },
  configs: {
    recommended: {
      rules: {
        'wyze/max-file-length': 2,
        'wyze/sort-imports': 2,
        'wyze/space-around-conditional': 2
      }
    }
  }
}
