import { RuleTester } from 'eslint'
import rule from '../newline-after-export'
import test from 'ava'

const parserOptions = {
  ecmaVersion: 2017,
  sourceType: 'module',
}
const message = 'Expected newline after export statement.'

test(() => {
  new RuleTester().run('newline-after-export', rule, {
    valid: [
      {
        code:
        `
        export const a = 1;
        export const b = 2;

        export default { a, b };
        `,
        parserOptions,
      },
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
        parserOptions,
      },
    ],
  })
})
