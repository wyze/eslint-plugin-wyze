import { RuleTester } from 'eslint'
import rule from '../func-call-arg-spacing'

const parserOptions = {
  ecmaVersion: 2017,
  sourceType: 'module',
}

const makeMissingError = location =>
  `There should be no space ${location} '${location === 'after' ? '(' : ')'}'.`

describe('func-call-arg-spacing', () => {
  it('passes RuleTester', () => {
    new RuleTester().run('func-call-arg-spacing', rule, {
      valid: [
        {
          code:
          `
          const f = ( a, b ) => a + b

          f(1, 2)
          `,
          parserOptions,
        },
        {
          code:
          `
          const f = ( a, b ) => a + b

          f()
          `,
          parserOptions,
        },
        {
          code:
          `
          const f = ( a, b ) => a + b

          f(
            1,
            2,
          )
          `,
          parserOptions,
        },
        {
          code:
          `
          const app = { use: () => {} }

          app.use(( req, res ) => {})
          `,
          parserOptions,
        },
        {
          code: '[].filter(x => x)',
          parserOptions,
        },
      ],
      invalid: [
        {
          code:
          `
          const f = ( a, b ) => a + b

          f( 1, 2 )
          `,
          parserOptions,
          errors: [
            makeMissingError('after'),
            makeMissingError('before'),
          ],
        },
        {
          code:
          `
          const f = () => {}

          f( )
          `,
          errors: [
            makeMissingError('after'),
          ],
          parserOptions,
        },
        {
          code:
          `
          const keys = properties
            .filter( prop => !prop.computed )
            .map( prop => prop.key.name )
          `,
          errors: [
            makeMissingError('after'),
            makeMissingError('before'),
            makeMissingError('after'),
            makeMissingError('before'),
          ],
          parserOptions,
        },
      ],
    })
  })
})
