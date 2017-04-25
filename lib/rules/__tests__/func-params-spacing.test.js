/* eslint-disable wyze/max-file-length */
import { RuleTester } from 'eslint'
import rule from '../func-params-spacing'

const parser = 'babel-eslint'
const parserOptions = {
  ecmaVersion: 2017,
  sourceType: 'module',
}

const makeRequiredError = location =>
  `A space is required ${location} '${location === 'after' ? '(' : ')'}'.`
const makeMissingError = location =>
  `There should be no space ${location} '${location === 'after' ? '(' : ')'}'.`

new RuleTester({ parserOptions }).run('func-params-spacing', rule, {
  valid: [
    'function foo( a, b, c ) {}',
    'const foo = function( a, b, c ) {}',
    'const foo = ( a, b, c ) => {}',
    'const foo = ({ a, b, c }) => {}',
    'const foo = ([ a, b, c ]) => {}',
    'const foo = ({ a }, b, { c }) => {}',
    'const foo = ({ a }, b, [ c ]) => {}',
    'const foo = ( { a }, b ) => {}',
    'const foo = ( b, [ c ] ) => {}',
    'const foo = () => {}',
    'const foo = a => {}',
    'function foo() {}',
    'const foo = function() {}',
    `
    const a = ({
      b,
      c,
    }) => {}
    `,
    `
    const assertStatement = assertSpacing(
      context,
      node => getSubnode(node, afterProps),
      node => getSubnode(node, beforeProps),
      () => false
    )
    `,
    `
    const keys = properties
      .filter(prop => !prop.computed)
      .map(prop => prop.key.name)
    `,
    'const a = b.reduce(() => Math.random(5), 0)',
    `
    const keys = properties
      .filter(function( a ) { return a })
    `,
    `
    class Component {
      componentWillMount() {
        // Do something...
      }
    }
    `,
    'const a = b.reduce(( c, d ) => c + d, 0)',
    {
      code: 'const foo = ({ a }: { a: string }): void => {}',
      parser,
    },
    {
      code: 'const foo = ( a: string ): void => {}',
      parser,
    },
    {
      code: 'const foo = ( { a }: Object ): void => {}',
      parser,
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
    },
    {
      code: 'const foo = ( a, b, c) => {}',
      errors: [
        makeRequiredError('before'),
      ],
    },
    {
      code: 'const foo = (a, b, c) => {}',
      errors: [
        makeRequiredError('after'),
        makeRequiredError('before'),
      ],
    },
    {
      code:
      `
      const a = b.reduce((c, d) => c + d, 0)
      `,
      errors: [
        makeRequiredError('after'),
        makeRequiredError('before'),
      ],
    },
    {
      code:
      `
      const a = b.reduce(( ) => Math.random(5), 0)
      `,
      errors: [
        makeMissingError('after'),
      ],
    },
    {
      code: 'const foo = ({ a } ) => {}',
      errors: [
        makeMissingError('before'),
      ],
    },
    {
      code: 'const foo = ( { a } ) => {}',
      errors: [
        makeMissingError('after'),
        makeMissingError('before'),
      ],
    },
    {
      code: 'const foo = ({ a }, b ) => {}',
      errors: [
        makeRequiredError('after'),
      ],
    },
    {
      code: 'const foo = ( { a }, b, [ c ] ) => {}',
      errors: [
        makeMissingError('after'),
        makeMissingError('before'),
      ],
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
    },
    {
      code: 'const foo = ( ) => {}',
      errors: [
        makeMissingError('after'),
      ],
    },
    {
      code: 'const foo = (a: string ) => {}',
      errors: [
        makeRequiredError('after'),
      ],
      parser,
    },

    // --fix assertions
    {
      code:
      `
      const a = b.reduce(( c, d) => c + d, 0)
      const a = b.reduce((c, d ) => c + d, 0)
      const a = b.reduce((c, d) => c + d, 0)
      const a = b.reduce(( ) => Math.random(5), 0)
      const a = b.reduce(function (c, d) { c + d }, 0)
      `,
      errors: 7,
      output:
      `
      const a = b.reduce(( c, d ) => c + d, 0)
      const a = b.reduce(( c, d ) => c + d, 0)
      const a = b.reduce(( c, d ) => c + d, 0)
      const a = b.reduce(() => Math.random(5), 0)
      const a = b.reduce(function ( c, d ) { c + d }, 0)
      `,
    },
    {
      code:
      `
      class Component {
        componentWillMount( ) {
          // Do something...
        }
      }

      class Component {
        componentWillMount(a ) {
          // Do something...
        }
      }

      class Component {
        componentWillMount(a) {
          // Do something...
        }
      }
      `,
      errors: 4,
      output:
      `
      class Component {
        componentWillMount() {
          // Do something...
        }
      }

      class Component {
        componentWillMount( a ) {
          // Do something...
        }
      }

      class Component {
        componentWillMount( a ) {
          // Do something...
        }
      }
      `,
    },
    {
      code:
      `
      const foo = ({ a } ) => {}
      const foo = ( { a } ) => {}
      const foo = ( { a }) => {}
      const foo = ({ a }, b ) => {}
      const foo = ( { a }, b) => {}
      const foo = ( { a }, b, [ c ] ) => {}
      const foo = ( { a }, b, [ c ]) => {}
      const foo = ({ a }, b, [ c ] ) => {}
      `,
      errors: 10,
      output:
      `
      const foo = ({ a }) => {}
      const foo = ({ a }) => {}
      const foo = ({ a }) => {}
      const foo = ( { a }, b ) => {}
      const foo = ( { a }, b ) => {}
      const foo = ({ a }, b, [ c ]) => {}
      const foo = ({ a }, b, [ c ]) => {}
      const foo = ({ a }, b, [ c ]) => {}
      `,
    },
    {
      code:
      `
      const foo = (a: string ) => {}
      const foo = (a: string) => {}
      const foo = ( a: string) => {}
      const foo = ({ a }: { a: string } ): void => {}
      const foo = ( { a }: { a: string } ): void => {}
      const foo = ( { a }: { a: string }): void => {}
      const foo = ({ a }: Object ): void => {}
      const foo = ( { a }: Object): void => {}
      const foo = ({ a }: Object): void => {}
      `,
      errors: 12,
      output:
      `
      const foo = ( a: string ) => {}
      const foo = ( a: string ) => {}
      const foo = ( a: string ) => {}
      const foo = ({ a }: { a: string }): void => {}
      const foo = ({ a }: { a: string }): void => {}
      const foo = ({ a }: { a: string }): void => {}
      const foo = ( { a }: Object ): void => {}
      const foo = ( { a }: Object ): void => {}
      const foo = ( { a }: Object ): void => {}
      `,
      parser,
    },
    {
      code:
      `
      function foo( a, b, c) {}
      function foo(a, b, c) {}
      function foo(a, b, c ) {}
      function foo( ) {}
      `,
      errors: 5,
      output:
      `
      function foo( a, b, c ) {}
      function foo( a, b, c ) {}
      function foo( a, b, c ) {}
      function foo() {}
      `,
    },
    {
      code:
      `
      const foo = function(a, b, c) {}
      const foo = function( a, b, c) {}
      const foo = function(a, b, c ) {}
      const foo = ( a, b, c) => {}
      const foo = (a, b, c ) => {}
      const foo = (a, b, c) => {}
      const foo = ( ) => {}
      const foo = function( ) {}
      `,
      errors: 10,
      output:
      `
      const foo = function( a, b, c ) {}
      const foo = function( a, b, c ) {}
      const foo = function( a, b, c ) {}
      const foo = ( a, b, c ) => {}
      const foo = ( a, b, c ) => {}
      const foo = ( a, b, c ) => {}
      const foo = () => {}
      const foo = function() {}
      `,
    },
    {
      code:
      `
      const foo = ( {
        a
      } ) => {}
      const foo = ({
        a
      } ) => {}
      const foo = ( {
        a
      }) => {}
      `,
      errors: 4,
      output:
      `
      const foo = ({
        a
      }) => {}
      const foo = ({
        a
      }) => {}
      const foo = ({
        a
      }) => {}
      `,
    },
  ],
})
