/* eslint-disable wyze/max-file-length */
import { RuleTester } from 'eslint'
import rule from '../sort-imports'

const parser = 'babel-eslint'
const parserOptions = {
  ecmaVersion: 2017,
  sourceType: 'module',
}
const expectedError = {
  message: 'Imports should be sorted alphabetically.',
  type: 'ImportDeclaration',
}
const ignoreCaseArgs = [ { ignoreCase: true } ]
const ignoreMemberSortArgs = [ { ignoreMemberSort: true } ]

new RuleTester({ parserOptions }).run('sort-imports', rule, {
  valid: [
    `
    import a from 'foo.js'
    import b from 'bar.js'
    import c from 'baz.js'
    `,
    `
    import * as B from 'foo.js'
    import A from 'bar.js'
    `,
    `
    import * as B from 'foo.js'
    import { a, b } from 'bar.js'
    `,
    `
    import { b, c } from 'bar.js'
    import A from 'foo.js'
    `,
    {
      code:
      `
      import A from 'bar.js'
      import { b, c } from 'foo.js'
      `,
      options: [
        {
          memberSyntaxSortOrder: [
            'default', 'type', 'named', 'none', 'all',
          ],
        },
      ],
    },
    `
    import { a, b } from 'bar.js'
    import { b, c } from 'foo.js'
    `,
    `
    import A from 'foo.js'
    import B from 'bar.js'
    `,
    `
    import A from 'foo.js'
    import a from 'bar.js'
    `,
    `
    import a, * as b from 'foo.js'
    import b from 'bar.js'
    `,
    `
    import 'foo.js'
    import a from 'bar.js'
    `,
    `
    import B from 'foo.js'
    import a from 'bar.js'
    `,
    {
      code:
      `
      import a from 'foo.js'
      import B from 'bar.js'
      `,
      options: ignoreCaseArgs,
    },
    `
    import { a, b, c, d } from 'foo.js'
    `,
    {
      code:
      `
      import { b, A, C, d } from 'foo.js'
      `,
      options: ignoreMemberSortArgs,
    },
    {
      code:
      `
      import { B, a, C, d } from 'foo.js'
      `,
      options: ignoreMemberSortArgs,
    },
    {
      code:
      `
      import { a, B, c, D } from 'foo.js'
      `,
      options: ignoreCaseArgs,
    },
    `
    import a, * as b from 'foo.js'
    `,
    `
    import * as a from 'foo.js'

    import b from 'bar.js'
    `,
    `
    import * as bar from 'bar.js'
    import * as foo from 'foo.js'
    `,
    // https://github.com/eslint/eslint/issues/5130
    {
      code:
      `
      import 'foo'
      import bar from 'bar'
      `,
      options: ignoreCaseArgs,
    },
    // https://github.com/eslint/eslint/issues/5305
    `
    import React, { Component } from 'react'
    `,
    `
    import { bar } from 'bar.js'
    import foo from 'foo.js'
    `,
    {
      code:
      `
      import type { A } from 'a'
      import * as B from 'b'
      `,
      parser,
    },
  ],
  invalid: [
    {
      code:
      `
      import a from 'foo.js'
      import A from 'bar.js'
      `,
      errors: [ expectedError ],
      output:
      `
      import A from 'bar.js'
      import a from 'foo.js'
      `,
    },
    {
      code:
      `
      import a from 'foo.js'

      import A from 'bar.js'
      `,
      errors: [ expectedError ],
      output:
      `
      import A from 'bar.js'

      import a from 'foo.js'
      `,
    },
    {
      code:
      `
      import b from 'foo.js'
      import a from 'bar.js'
      `,
      errors: [ expectedError ],
      output:
      `
      import a from 'bar.js'
      import b from 'foo.js'
      `,
    },
    {
      code:
      `
      import { b, c } from 'foo.js'
      import { a, b } from 'bar.js'
      `,
      output:
      `
      import { a, b } from 'bar.js'
      import { b, c } from 'foo.js'
      `,
      errors: [ expectedError ],
    },
    {
      code:
      `
      import * as foo from 'foo.js'
      import * as bar from 'bar.js'
      `,
      output:
      `
      import * as bar from 'bar.js'
      import * as foo from 'foo.js'
      `,
      errors: [ expectedError ],
    },
    {
      code:
      `
      import a from 'foo.js'
      import { b, c } from 'bar.js'
      `,
      output:
      `
      import { b, c } from 'bar.js'
      import a from 'foo.js'
      `,
      errors: [
        {
          message: "Expected 'named' syntax before 'default' syntax.",
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code:
      `
      import a from 'foo.js'
      import * as b from 'bar.js'
      `,
      output:
      `
      import * as b from 'bar.js'
      import a from 'foo.js'
      `,
      errors: [
        {
          message: "Expected 'all' syntax before 'default' syntax.",
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code:
      `
      import a from 'foo.js'
      import 'bar.js'
      `,
      output:
      `
      import 'bar.js'
      import a from 'foo.js'
      `,
      errors: [
        {
          message: "Expected 'none' syntax before 'default' syntax.",
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code:
      `
      import b from 'bar.js'
      import * as a from 'foo.js'
      `,
      output:
      `
      import * as a from 'foo.js'
      import b from 'bar.js'
      `,
      options: [
        {
          memberSyntaxSortOrder: [
            'all', 'type', 'default', 'named', 'none',
          ],
        },
      ],
      errors: [
        {
          message: "Expected 'all' syntax before 'default' syntax.",
          type: 'ImportDeclaration',
        },
      ],
    },
    {
      code:
      `
      import { b, a, d, c } from 'foo.js'
      `,
      output:
      `
      import { a, b, c, d } from 'foo.js'
      `,
      errors: [
        {
          message: "Member 'a' of the import declaration should be sorted" +
            ' alphabetically.',
          type: 'ImportSpecifier',
        },
        {
          message: "Member 'c' of the import declaration should be sorted" +
            ' alphabetically.',
          type: 'ImportSpecifier',
        },
      ],
    },
    {
      code:
      `
      import { a, B, c, D } from 'foo.js'
      `,
      output:
      `
      import { B, a, D, c } from 'foo.js'
      `,
      errors: [
        {
          message: "Member 'B' of the import declaration should be sorted" +
            ' alphabetically.',
          type: 'ImportSpecifier',
        },
        {
          message: "Member 'D' of the import declaration should be sorted" +
            ' alphabetically.',
          type: 'ImportSpecifier',
        },
      ],
    },
    {
      code:
      `
      import B from 'b'
      import type { C } from 'c'
      `,
      output:
      `
      import type { C } from 'c'
      import B from 'b'
      `,
      parser,
      errors: [
        {
          message: "Expected 'type' syntax before 'default' syntax.",
          type: 'ImportDeclaration',
        },
      ],
    },

    // `--fix` assertions
    // all syntax
    {
      code:
      `
      import * as foo from 'foo.js'
      import * as baz from 'baz.js'
      import * as bar from 'bar.js'
      import * as Foo from 'Foo.js'
      `,
      errors: 3,
      output:
      `
      import * as Foo from 'Foo.js'
      import * as bar from 'bar.js'
      import * as baz from 'baz.js'
      import * as foo from 'foo.js'
      `,
    },
    // default syntax
    {
      code:
      `
      import a from 'foo.js'
      import A from 'bar.js'
      import b from 'foobar.js'
      import C from 'baz.js'
      `,
      errors: 2,
      output:
      `
      import A from 'bar.js'
      import C from 'baz.js'
      import a from 'foo.js'
      import b from 'foobar.js'
      `,
    },
    // named syntax
    {
      code:
      `
      import { b, c } from 'foo.js'
      import { a, b } from 'bar.js'
      import { b, C } from 'foobar.js'
      import { A, b, D, e } from 'baz.js'
      `,
      errors: 4,
      output:
      `
      import { A, D, b, e } from 'baz.js'
      import { C, b } from 'foobar.js'
      import { a, b } from 'bar.js'
      import { b, c } from 'foo.js'
      `,
    },
    // none syntax
    {
      code:
      `
      import a from 'foo.js'
      import 'bar.js'
      import { b, c } from 'foobar.js'
      import 'baz.js'
      `,
      errors: 2,
      output:
      `
      import 'bar.js'
      import 'baz.js'
      import { b, c } from 'foobar.js'
      import a from 'foo.js'
      `,
    },
    // type syntax
    {
      code:
      `
      import B from 'b'
      import type { C } from 'c'
      import 'd'
      import type { A } from 'a'
      `,
      errors: 2,
      output:
      `
      import 'd'
      import type { A } from 'a'
      import type { C } from 'c'
      import B from 'b'
      `,
      parser,
    },
    // ignoreCase: true
    {
      code:
      `
      import B from 'b'
      import a from 'a'
      `,
      errors: 1,
      options: ignoreCaseArgs,
      output:
      `
      import a from 'a'
      import B from 'b'
      `,
    },
    // ignoreMemberSort: true
    {
      code:
      `
      import { a, B, c, D } from 'a'
      import { E, f, g, H } from 'b'
      `,
      errors: 1,
      options: ignoreMemberSortArgs,
      output:
      `
      import { E, f, g, H } from 'b'
      import { a, B, c, D } from 'a'
      `,
    },
    // memberSyntaxSortOrder: [ 'type', 'all', 'none', 'default', 'named' ]
    {
      code:
      `
      import { e } from 'e'
      import a from 'a'
      import 'c'
      import type { D } from 'd'
      import * as b from 'b'
      `,
      errors: 3,
      options: [
        { memberSyntaxSortOrder: [ 'type', 'all', 'none', 'default', 'named' ] },
      ],
      output:
      `
      import type { D } from 'd'
      import * as b from 'b'
      import 'c'
      import a from 'a'
      import { e } from 'e'
      `,
      parser,
    },
  ],
})
