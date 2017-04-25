import { RuleTester } from 'eslint'
import rule from '../max-file-length'

new RuleTester().run('max-file-length', rule, {
  valid: [
    `
    'function noop() {}'
    `,
    {
      code:
      `
      function noop() {}
      `,
      options: [ 5 ],
    },
  ],
  invalid: [
    {
      code:
      `
      function noop() {
        console.log('This function does nothing.')
      }
      `,
      errors: [
        { message: 'Max lines set to 3. File contains 5 lines.' },
      ],
      options: [ 3 ],
    },
  ],
})
