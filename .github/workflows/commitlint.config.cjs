module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat','fix','docs','style','refactor','test','chore','ci','perf','build','revert'
    ]],
    'subject-case': [2, 'never', ['sentence-case','start-case','pascal-case','upper-case']],
    'header-max-length': [2, 'always', 100]
  }
};
