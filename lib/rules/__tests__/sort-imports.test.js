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
const beforeError = ( a, b ) => `Expected '${a}' syntax before '${b}' syntax.`
const ignoreCaseArgs = [ { ignoreCase: true } ]
const ignoreMemberSortArgs = [ { ignoreMemberSort: true } ]

const imports = {
  all: "import * as a from 'a'",
  default: "import b from 'b'",
  named: "import { c } from 'c'",
  none: "import 'd'",
  type: "import type { E } from 'e'",
}

const makeMemberSyntaxSortOrderTest = ( memberSyntaxSortOrder, a, b ) => ({
  code:
  `
  ${imports[b]}
  ${imports[a]}
  `,
  errors: [ beforeError(a, b) ],
  options: [
    { memberSyntaxSortOrder },
  ],
  output:
  `
  ${imports[a]}
  ${imports[b]}
  `,
  parser,
})

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
    import { c, d } from 'foo.js'
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
    import c from 'bar.js'
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
      import { a, d } from 'bar.js'
      `,
      output:
      `
      import { a, d } from 'bar.js'
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
      import * as Foo from 'Foo.js'
      `,
      errors: [
        expectedError,
      ],
      output:
      `
      import * as Foo from 'Foo.js'
      import * as foo from 'foo.js'
      `,
    },
    // default syntax
    {
      code:
      `
      import a from 'foo.js'
      import A from 'bar.js'
      `,
      errors: [
        expectedError,
      ],
      output:
      `
      import A from 'bar.js'
      import a from 'foo.js'
      `,
    },
    // named syntax
    {
      code:
      `
      import { a, b } from 'bar.js'
      import { A, c, D, e } from 'baz.js'
      `,
      errors: 2,
      output:
      `
      import { A, c, D, e } from 'baz.js'
      import { a, b } from 'bar.js'
      `,
    },
    // none syntax
    {
      code:
      `
      import a from 'foo.js'
      import 'bar.js'
      `,
      errors: 1,
      output:
      `
      import 'bar.js'
      import a from 'foo.js'
      `,
    },
    {
      code:
      `
      import { b, c } from 'foobar.js'
      import 'bar.js'
      `,
      errors: 1,
      output:
      `
      import 'bar.js'
      import { b, c } from 'foobar.js'
      `,
    },
    {
      code:
      `
      import a from 'foo.js'
      import { b, c } from 'foobar.js'
      `,
      errors: 1,
      output:
      `
      import { b, c } from 'foobar.js'
      import a from 'foo.js'
      `,
    },
    // type syntax
    {
      code:
      `
      import type { C } from 'c'
      import 'd'
      `,
      errors: 1,
      output:
      `
      import 'd'
      import type { C } from 'c'
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
  ].concat(
    // memberSyntaxSortOrder: [ 'type', 'all', 'none', 'default', 'named' ]
    makeMemberSyntaxSortOrderTest(
      [ 'type', 'all', 'none', 'default', 'named' ],
      'default', 'named'
    ),
    makeMemberSyntaxSortOrderTest(
      [ 'type', 'all', 'none', 'default', 'named' ],
      'none', 'default'
    ),
    makeMemberSyntaxSortOrderTest(
      [ 'type', 'all', 'none', 'default', 'named' ],
      'none', 'named'
    ),
    makeMemberSyntaxSortOrderTest(
      [ 'type', 'all', 'none', 'default', 'named' ],
      'all', 'none'
    ),
    makeMemberSyntaxSortOrderTest(
      [ 'type', 'all', 'none', 'default', 'named' ],
      'all', 'default'
    ),
    makeMemberSyntaxSortOrderTest(
      [ 'type', 'all', 'none', 'default', 'named' ],
      'all', 'named'
    ),
    makeMemberSyntaxSortOrderTest(
      [ 'type', 'all', 'none', 'default', 'named' ],
      'type', 'all'
    ),
    makeMemberSyntaxSortOrderTest(
      [ 'type', 'all', 'none', 'default', 'named' ],
      'type', 'none'
    ),
    makeMemberSyntaxSortOrderTest(
      [ 'type', 'all', 'none', 'default', 'named' ],
      'type', 'default'
    ),
    makeMemberSyntaxSortOrderTest(
      [ 'type', 'all', 'none', 'default', 'named' ],
      'type', 'named'
    )
  ),
})
