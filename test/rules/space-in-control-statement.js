import { RuleTester } from 'eslint'
import rule from '../../lib/rules/space-in-control-statement'
import test from 'ava'

const expectedError = ( loc, type ) => ({
  message: `There must be a space ${loc} this paren.`,
  type: `${type}Statement`,
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
    {
      code:
        `
        for ( var i = 0; i < 10; i++ ) {
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
        expectedError('after', 'If')
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
        expectedError('before', 'If')
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
        expectedError('after', 'If'),
        expectedError('before', 'If')
      ]
    },
    {
      code:
        `
        for (var i = 0; i < 1; i++ ) {
          // Do something...
        }
        `,
      errors: [
        expectedError('after', 'For')
      ]
    },
    {
      code:
        `
        for ( var i = 0; i < 1; i++) {
          // Do something...
        }
        `,
      errors: [
        expectedError('before', 'For')
      ]
    },
    {
      code:
        `
        for (var i = 0; i < 1; i++) {
          // Do something...
        }
        `,
      errors: [
        expectedError('after', 'For'),
        expectedError('before', 'For')
      ]
    },
  ]
})

test(async t => t.pass())
