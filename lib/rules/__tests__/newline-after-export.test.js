import { RuleTester } from 'eslint'
import rule from '../newline-after-export'

const parserOptions = {
  ecmaVersion: 2017,
  sourceType: 'module',
}
const message = 'Expected newline after export statement.'

new RuleTester({ parserOptions }).run('newline-after-export', rule, {
  valid: [
    `
    export const a = 1;
    export const b = 2;

    export default { a, b };
    `,
  ],
  invalid: [
    {
      code:
      `
      export const a = 1;
      const b = 1;
      `,
      errors: [
        { message },
      ],
    },

    // --fix assertions
    {
      code:
      `
      export default 1
      const b = 2
      `,
      errors: 1,
      output:
      `
      export default 1

      const b = 2
      `,
    },
    {
      code:
      `
      export const a = 1
      const b = 2
      `,
      errors: 1,
      output:
      `
      export const a = 1

      const b = 2
      `,
    },
  ],
})
