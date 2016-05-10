import { RuleTester } from 'eslint'
import rule from '../../lib/rules/newline-after-export'
import test from 'ava'

const parserOptions = {
  ecmaVersion: 6,
  sourceType: "module"
}
const message =
  'Expected empty line after export statement not followed by another export.'

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
    // invalid: [
    //   {
    //     code:
    //     `
    //     function noop() {
    //       console.log('This function does nothing.')
    //     }
    //     `,
    //     errors: [
    //       { message: 'Max lines is set to 3. File contains 5 lines.' },
    //     ],
    //     options: [3],
    //   },
    // ],
  })
})
