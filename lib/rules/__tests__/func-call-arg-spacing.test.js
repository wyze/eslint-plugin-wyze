import { RuleTester } from 'eslint'
import rule from '../func-call-arg-spacing'

const parserOptions = {
  ecmaVersion: 2017,
  sourceType: 'module',
}

const makeMissingError = location =>
  `There should be no space ${location} '${location === 'after' ? '(' : ')'}'.`

new RuleTester({ parserOptions }).run('func-call-arg-spacing', rule, {
  valid: [
    `
    const f = ( a, b ) => a + b

    f(1, 2)
    `,
    `
    const f = ( a, b ) => a + b

    f()
    `,
    `
    const f = ( a, b ) => a + b

    f(
      1,
      2,
    )
    `,
    `
    const app = { use: () => {} }

    app.use(( req, res ) => {})
    `,
    '[].filter(x => x)',
  ],
  invalid: [
    {
      code:
      `
      const f = ( a, b ) => a + b

      f( 1, 2 )
      `,
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
    },

    // --fix assertions
    {
      code:
      `
      const a = properties
        .filter( prop => !prop.computed)

      const b = properties
        .map(prop => prop.key.name )

      const c = properties
        .filter( prop => !prop.computed )
        .map( prop => prop.key.name )

      const app = { use: () => {} }

      app.use( ( req, res ) => {})

      [ 1 ].filter( x => x )
      `,
      errors: 9,
      output:
      `
      const a = properties
        .filter(prop => !prop.computed)

      const b = properties
        .map(prop => prop.key.name)

      const c = properties
        .filter(prop => !prop.computed)
        .map(prop => prop.key.name)

      const app = { use: () => {} }

      app.use(( req, res ) => {})

      [ 1 ].filter(x => x)
      `,
    },
    {
      code:
      `
      const f = ( a, b ) => a + b

      f( 1,
        2)
      f(1,
        2 )
      f( 1,
        2 )

      f( )

      f( 1, 2 )
      f( 1, 2)
      f(1, 2 )
      `,
      errors: 9,
      output:
      `
      const f = ( a, b ) => a + b

      f(1,
        2)
      f(1,
        2)
      f(1,
        2)

      f()

      f(1, 2)
      f(1, 2)
      f(1, 2)
      `,
    },
  ],
})
