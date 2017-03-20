/* eslint-disable wyze/max-file-length */
import { RuleTester } from 'eslint'
import rule from '../func-params-spacing'
import test from 'ava'

const parserOptions = {
  ecmaVersion: 2017,
  sourceType: 'module',
}

const makeRequiredError = location =>
  `A space is required ${location} '${location === 'after' ? '(' : ')'}'.`
const makeMissingError = location =>
  `There should be no space ${location} '${location === 'after' ? '(' : ')'}'.`

test(() => {
  new RuleTester().run('func-params-spacing', rule, {
    valid: [
      {
        code: 'function foo( a, b, c ) {}',
      },
      {
        code: 'const foo = function( a, b, c ) {}',
        parserOptions,
      },
      {
        code: 'const foo = ( a, b, c ) => {}',
        parserOptions,
      },
      {
        code: 'const foo = ({ a, b, c }) => {}',
        parserOptions,
      },
      {
        code: 'const foo = ([ a, b, c ]) => {}',
        parserOptions,
      },
      {
        code: 'const foo = ({ a }, b, { c }) => {}',
        parserOptions,
      },
      {
        code: 'const foo = ({ a }, b, [ c ]) => {}',
        parserOptions,
      },
      {
        code: 'const foo = ( { a }, b ) => {}',
        parserOptions,
      },
      {
        code: 'const foo = ( b, [ c ] ) => {}',
        parserOptions,
      },
      {
        code: 'const foo = () => {}',
        parserOptions,
      },
      {
        code: 'const foo = a => {}',
        parserOptions,
      },
      {
        code: 'function foo() {}',
        parserOptions,
      },
      {
        code: 'const foo = function() {}',
        parserOptions,
      },
      {
        code:
        `
        const a = ({
          b,
          c,
        }) => {}
        `,
        parserOptions,
      },
      {
        code:
        `
        const keys = properties
          .filter(prop => !prop.computed)
          .map(prop => prop.key.name)
        `,
        parserOptions,
      },
      {
        code:
        `
        const keys = properties
          .filter(function( a ) { return a })
        `,
        parserOptions,
      },
      {
        code: 'const foo = ({ a }: { a: string }): void => {}',
        parser: 'babel-eslint',
        parserOptions,
      },
      {
        code: 'const foo = ( a: string ): void => {}',
        parser: 'babel-eslint',
        parserOptions,
      },
      {
        code: 'const foo = ( { a }: Object ): void => {}',
        parser: 'babel-eslint',
        parserOptions,
      },
    ],
    invalid: [
      {
        code: 'function foo( a, b, c) {}',
        errors: [
          makeRequiredError('before'),
        ],
      },
      {
        code: 'function foo(a, b, c) {}',
        errors: [
          makeRequiredError('after'),
          makeRequiredError('before'),
        ],
      },
      {
        code: 'const foo = function(a, b, c ) {}',
        errors: [
          makeRequiredError('after'),
        ],
        parserOptions,
      },
      {
        code: 'const foo = ( a, b, c) => {}',
        errors: [
          makeRequiredError('before'),
        ],
        parserOptions,
      },
      {
        code: 'const foo = (a, b, c) => {}',
        errors: [
          makeRequiredError('after'),
          makeRequiredError('before'),
        ],
        parserOptions,
      },
      {
        code: 'const foo = ({ a } ) => {}',
        errors: [
          makeMissingError('before'),
        ],
        parserOptions,
      },
      {
        code: 'const foo = ( { a } ) => {}',
        errors: [
          makeMissingError('after'),
          makeMissingError('before'),
        ],
        parserOptions,
      },
      {
        code: 'const foo = ({ a }, b ) => {}',
        errors: [
          makeRequiredError('after'),
        ],
        parserOptions,
      },
      {
        code: 'const foo = ( { a }, b, [ c ] ) => {}',
        errors: [
          makeMissingError('after'),
          makeMissingError('before'),
        ],
        parserOptions,
      },
      {
        code:
        `
        const foo = ( {
          a
        }) => {}
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
      {
        code: 'const foo = ( ) => {}',
        errors: [
          makeMissingError('after'),
        ],
        parserOptions,
      },
      {
        code: 'const foo = (a: string ) => {}',
        errors: [
          makeRequiredError('after'),
        ],
        parser: 'babel-eslint',
        parserOptions,
      },
    ],
  })
})

