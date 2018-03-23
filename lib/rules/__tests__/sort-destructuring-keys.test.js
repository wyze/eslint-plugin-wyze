/* eslint-disable wyze/max-file-length */
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
    {
      code:
      `
      const props = { a: 1, B: 2 }
      const { z, a = z, b, [props.a]: c } = props
      `,
      options: [ 'asc', { ignoreComputed: true, ignoreDefaults: false } ],
    },
    {
      code:
      `
      const props = { z: () => 2 }
      const { c = 10, z, a = z() + c } = props
      `,
      options: [ 'asc', { ignoreComputed: true, ignoreDefaults: false } ],
    },
    {
      code:
      `
      const props = { z: x => x }
      const { c = 10, a, z = a(c + 10 + a(5 + c)) } = props
      `,
      options: [ 'desc', { ignoreComputed: true, ignoreDefaults: false } ],
    },
    {
      code:
      `
      const props = { z: x => x }
      const { c = 10, y, z, a = y ? 2 : z(c ? 10 : z(5 + c)) } = props      
     `,
      options: [ 'asc', { ignoreComputed: true, ignoreDefaults: false } ],
    },
    {
      code:
      `
      const props = { z: x => x }
      const { a = y ? 2 : z(c ? 10 : z(5 + c)), c = 10, y, z } = props      
     `,
      options: [ 'asc', { ignoreComputed: true } ],
    },
    {
      code:
      `
      const props = { z: x => x }
      const { c = 10, y, z, a = y ? c && z : z(c ? 10 : z(5 + c)) } = props
      `,
      options: [ 'asc', { ignoreComputed: true, ignoreDefaults: false } ],
    },
    {
      code:
      `
      const props = {}
      const { c = 10, a = (x = c) => z, z } = props      
      `,
      options: [ 'asc', { ignoreDefaults: false } ],
    },
    {
      code:
      `
      const props = {}
      const { c = 10, z, a = ((x = c) => z)() } = props      
      `,
      options: [ 'asc', { ignoreDefaults: false } ],
    },
    {
      code:
      `
      const props = {}
      const { c = 10, a = (x = c) => { z + x }, z } = props      
      `,
      options: [ 'asc', { ignoreDefaults: false } ],
    },
    {
      code:
      `
      const props = {}
      const { z, a = [2][z], c = 10, } = props      
      `,
      options: [ 'asc', { ignoreDefaults: false } ],
    },
    {
      code:
      `
      const props = { a: 1, b: 2 }
      const { [a + b]: c, a, b} = props
     `,
      options: [ 'asc', { ignoreDefaults: false } ],
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
    }, {
      code:
      `
      const props = { a: 1, b: 2 }
      const { a, c, b = a } = props
      `,
      errors: [
        {
          message: 'Destructuring keys should be sorted in ascending order.' +
                " 'b' should be before 'c'.",
        },
      ],
    },
    {
      code:
      `
      const props = { a: 1, b: 2 }
      const { a, c, b = (c = a) => c } = props
      `,
      errors: [
        {
          message: 'Destructuring keys should be sorted in ascending order.' +
                " 'b' should be before 'c'.",
        },
      ],
    },
    {
      code:
     `
     const z = 2
     const props = { a: 1, B: 2 }
     const { b = z, a = z } = props
     `,
      options: [ 'asc', { ignoreComputed: true } ],
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
      const props = { a: 1, B: 2 }
      const { c = 10, a = () => c } = props
      `,
      options: [ 'asc', { ignoreComputed: true, ignoreDefaults: false } ],
      errors: [
        {
          message: 'Destructuring keys should be sorted in ascending order.' +
                     " 'a' should be before 'c'.",
        },
      ],
    },
    {
      code:
       `
       const props = { a: 1, B: 2 }
       const { z, a = z, b, [props.a]: c } = props
       `,
      options: [ 'asc', { ignoreComputed: true } ],
      errors: [
        {
          message: 'Destructuring keys should be sorted in ascending order.' +
                         " 'a' should be before 'z'.",
        },
      ],
    },
    {
      code:
      `
     const props = { z: () => 2 }
     const { z, c = 10, a = z() + c } = props
     `,
      options: [ 'asc', { ignoreComputed: true } ],
      errors: [
        {
          message: 'Destructuring keys should be sorted in ascending order.' +
                    " 'c' should be before 'z'.",
        },
        {
          message: 'Destructuring keys should be sorted in ascending order.' +
                              " 'a' should be before 'c'.",
        },
      ],
    },
    {
      code:
      `
      const props = {}
      const { z, a = z } = props      
      `,
      options: [ 'asc', { ignoreDefaults: true } ],
      errors: [
        {
          message: 'Destructuring keys should be sorted in ascending order.' +
                    " 'a' should be before 'z'.",
        },
      ],
    },
  ],
})
