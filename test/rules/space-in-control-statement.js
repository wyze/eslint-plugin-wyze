import { RuleTester } from 'eslint'
import rule from '../../lib/rules/space-in-control-statement'
import test from 'ava'

const expectedError = loc => ({
  message: `There must be a space ${loc} this paren.`,
  type: 'IfStatement',
})

new RuleTester().run('space-in-control-statement', rule, {
  valid: [
    {
      code:
        `
        if ( 1 + 1 === 2 && true ) {
          // Do something...
        }
        `
    },
  ],
  invalid: [
    {
      code:
        `
        if (true ) {
          // Do something...
        }
        `,
      errors: [
        expectedError('after')
      ]
    },
    {
      code:
        `
        if ( true) {
          // Do something...
        }
        `,
      errors: [
        expectedError('before')
      ]
    },
    {
      code:
        `
        if (true) {
          // Do something...
        }
        `,
      errors: [
        expectedError('after'),
        expectedError('before')
      ]
    },
  ]
})

test(async t => t.pass())
