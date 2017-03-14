import { RuleTester } from 'eslint'
import rule from '../../lib/rules/sort-destructuring-keys'
import test from 'ava'

const parserOptions = {
  ecmaVersion: 7,
  sourceType: 'module',
}

test(() => {
  new RuleTester().run('sort-destructuring-keys', rule, {
    valid: [
      {
        code:
        `
        const props = { a: 1, b: 2 }
        const { a, b } = props
        `,
        parserOptions,
      },
      {
        code:
        `
        const props = { a: 1, B: 2 }
        const { B, a } = props
        `,
        parserOptions,
      },
      {
        code:
        `
        const props = { a: 1, b: 2, c: 'a' }
        const { [props.a]: c } = props
        const { [props.c.toUpperCase()]: c, } = props
        `,
        parserOptions,
      },
      {
        code:
        `
        const props = { a: 1, B: 2, c: 'B' }
        const { a, B } = props
        const { c, a } = props
        const { [props.c.toUpperCase()]: c, B } = props
        `,
        parserOptions,
        options: [ 'desc' ],
      },
      {
        code:
        `
        const props = { a: 1, B: 2 }
        const { a, B } = props
        `,
        parserOptions,
        options: [ 'asc', { caseSensitive: false } ],
      },
      {
        code:
        `
        const props = { a: 1, B: 2 }
        const { B, a } = props
        `,
        parserOptions,
        options: [ 'desc', { caseSensitive: false } ],
      },
      {
        code:
        `
        const props = { a: 1, B: 2 }
        const { a, b, [props.a]: c } = props
        `,
        parserOptions,
        options: [ 'asc', { ignoreComputed: true } ],
      },
    ],
    invalid: [
      {
        code:
        `
        const props = { a: 1, b: 2 }
        const { b: a, a: b } = props
        `,
        errors: [
          {
            message: 'Destructuring keys should be sorted in ascending order. ' +
              '\'a\' should be before \'b\'.',
          },
        ],
        parserOptions,
      },
      {
        code:
        `
        const props = { a: 1, b: 2 }
        const { a, b, [a + b]: c } = props
        `,
        errors: [
          {
            message: 'Computed properties must be placed before all other properties.',
          },
        ],
        parserOptions,
      },
      {
        code:
        `
        const props = { a: 1, b: 2, B: 3 }
        const { a, b } = props
        const { a, B } = props
        `,
        errors: [
          {
            message: 'Destructuring keys should be sorted in descending order. ' +
              '\'b\' should be before \'a\'.',
          },
        ],
        parserOptions,
        options: [ 'desc' ],
      },
      {
        code:
        `
        const props = { a: 1, B: 2 }
        const { B, a } = props
        `,
        errors: [
          {
            message: 'Destructuring keys should be sorted in insensitive ascending order. ' +
              '\'a\' should be before \'B\'.',
          },
        ],
        parserOptions,
        options: [ 'asc', { caseSensitive: false } ],
      },
      {
        code:
        `
        const props = { a: 1, B: 2 }
        const { a, B } = props
        `,
        errors: [
          {
            message: 'Destructuring keys should be sorted in insensitive descending order. ' +
              '\'B\' should be before \'a\'.',
          },
        ],
        parserOptions,
        options: [ 'desc', { caseSensitive: false } ],
      },
    ],
  })
})
