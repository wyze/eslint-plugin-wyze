import { RuleTester } from 'eslint'
import rule from '../sort-destructuring-keys'

const parserOptions = {
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
  },
  ecmaVersion: 2017,
  sourceType: 'module',
}

new RuleTester({ parserOptions }).run('sort-destructuring-keys', rule, {
  valid: [
    {
      code:
      `
      const props = { a: 1, b: 2 }
      const { a, b } = props
      `,
    },
    {
      code:
      `
      const props = { a: 1, B: 2 }
      const { B, a } = props
      `,
    },
    {
      code:
      `
      const props = { a: 1, b: 2, c: 'a' }
      const { [props.a]: c } = props
      const { [props.c.toUpperCase()]: c2 } = props
      `,
    },
    {
      code:
      `
      const props = { a: 1, b: 2, c: 'a' }
      const { a, ...rest } = props
      `,
    },
    {
      code:
      `
      const props = { a: 1, B: 2, c: 'B' }
      const { a, B } = props
      const { c, a: a2 } = props
      const { [props.c.toUpperCase()]: c2, B: B2 } = props
      `,
      options: [ 'desc' ],
    },
    {
      code:
      `
      const props = { a: 1, B: 2 }
      const { a, B } = props
      `,
      options: [ 'asc', { caseSensitive: false } ],
    },
    {
      code:
      `
      const props = { a: 1, B: 2 }
      const { B, a } = props
      `,
      options: [ 'desc', { caseSensitive: false } ],
    },
    {
      code:
      `
      const props = { a: 1, B: 2 }
      const { a, b, [props.a]: c } = props
      `,
      options: [ 'asc', { ignoreComputed: true } ],
    },
    {
      code:
      `
      const props = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 10, k: 11 }
      const { a, b, c, d, e, f, g, h, i, j, k } = props
      `,
    },
  ],
  // invalid: [],
  invalid: [
    {
      code:
      `
      const props = { a: 1, b: 2 }
      const { b: a, a: b } = props
      `,
      errors: [
        {
          message: 'Destructuring keys should be sorted in ascending order.' +
            " 'a' should be before 'b'.",
        },
      ],
    },
    {
      code:
      `
      const props = { a: 1, b: 2 }
      const { a, b, [a + b]: c } = props
      `,
      errors: [
        {
          message: 'Computed properties must be placed before all other ' +
            'properties.',
        },
      ],
    },
    {
      code:
      `
      const props = { a: 1, b: 2, B: 3 }
      const { a, b } = props
      const { a: a1, B } = props
      `,
      errors: [
        {
          message: 'Destructuring keys should be sorted in descending ' +
            "order. 'b' should be before 'a'.",
        },
      ],
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
          message: 'Destructuring keys should be sorted in insensitive ' +
            "ascending order. 'a' should be before 'B'.",
        },
      ],
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
          message: 'Destructuring keys should be sorted in insensitive ' +
            "descending order. 'B' should be before 'a'.",
        },
      ],
      options: [ 'desc', { caseSensitive: false } ],
    },
  ],
})
