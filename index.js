module.exports = {
  rules: {
    "space-around-conditional": require('./lib/rules/space-around-conditional'),
    "sort-imports": require('./lib/rules/sort-imports')
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
