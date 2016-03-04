module.exports = {
  rules: {
    'sort-imports': require('./lib/rules/sort-imports'),
    'space-around-conditional': require('./lib/rules/space-around-conditional')
  },
  configs: {
    recommended: {
      rules: {
        'wyze/sort-imports': 2,
        'wyze/space-around-conditional': 2
      }
    }
  }
}
