/* eslint-disable wyze/max-file-length */
import { RuleTester } from 'eslint'
import rule from '../../lib/rules/sort-imports'
import test from 'ava'

const parserOptions = {
  ecmaVersion: 7,
  sourceType: 'module',
}
const expectedError = {
  message: 'Imports should be sorted alphabetically.',
  type: 'ImportDeclaration',
}
const ignoreCaseArgs = [ { ignoreCase: true } ]
const ignoreMemberSortArgs = [ { ignoreMemberSort: true } ]

test(() => {
  new RuleTester().run('sort-imports', rule, {
    valid: [
      {
        code:
        `
        import a from 'foo.js'
        import b from 'bar.js'
        import c from 'baz.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import * as B from 'foo.js'
        import A from 'bar.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import * as B from 'foo.js'
        import { a, b } from 'bar.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import { b, c } from 'bar.js'
        import A from 'foo.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import A from 'bar.js'
        import { b, c } from 'foo.js'
        `,
        parserOptions,
        options: [
          {
            memberSyntaxSortOrder: [ 'default', 'named', 'none', 'all' ],
          },
        ],
      },
      {
        code:
        `
        import { a, b } from 'bar.js'
        import { b, c } from 'foo.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import A from 'foo.js'
        import B from 'bar.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import A from 'foo.js'
        import a from 'bar.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import a, * as b from 'foo.js'
        import b from 'bar.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import 'foo.js'
        import a from 'bar.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import B from 'foo.js'
        import a from 'bar.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import a from 'foo.js'
        import B from 'bar.js'
        `,
        parserOptions,
        options: ignoreCaseArgs,
      },
      {
        code:
        `
        import { a, b, c, d } from 'foo.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import { b, A, C, d } from 'foo.js'
        `,
        parserOptions,
        options: ignoreMemberSortArgs,
      },
      {
        code:
        `
        import { B, a, C, d } from 'foo.js'
        `,
        parserOptions,
        options: ignoreMemberSortArgs,
      },
      {
        code:
        `
        import { a, B, c, D } from 'foo.js'
        `,
        parserOptions,
        options: ignoreCaseArgs,
      },
      {
        code:
        `
        import a, * as b from 'foo.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import * as a from 'foo.js'

        import b from 'bar.js'
        `,
        parserOptions,
      },
      {
        code:
        `
        import * as bar from 'bar.js'
        import * as foo from 'foo.js'
        `,
        parserOptions,
      },
      // https://github.com/eslint/eslint/issues/5130
      {
        code:
        `
        import 'foo'
        import bar from 'bar'
        `,
        parserOptions,
        options: ignoreCaseArgs,
      },
      // https://github.com/eslint/eslint/issues/5305
      {
        code:
        `
        import React, { Component } from 'react'
        `,
        parserOptions,
      },
      {
        code:
        `
        import { bar } from 'bar.js'
        import foo from 'foo.js'
        `,
        parserOptions,
      },
    ],
    invalid: [
      {
        code:
        `
        import a from 'foo.js'
        import A from 'bar.js'
        `,
        parserOptions,
        errors: [ expectedError ],
      },
      {
        code:
        `
        import b from 'foo.js'
        import a from 'bar.js'
        `,
        parserOptions,
        errors: [ expectedError ],
      },
      {
        code:
        `
        import { b, c } from 'foo.js'
        import { a, b } from 'bar.js'
        `,
        parserOptions,
        errors: [ expectedError ],
      },
      {
        code:
        `
        import * as foo from 'foo.js'
        import * as bar from 'bar.js'
        `,
        parserOptions,
        errors: [ expectedError ],
      },
      {
        code:
        `
        import a from 'foo.js'
        import { b, c } from 'bar.js'
        `,
        parserOptions,
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
        parserOptions,
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
        parserOptions,
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
        parserOptions,
        options: [
          {
            memberSyntaxSortOrder: [ 'all', 'default', 'named', 'none' ],
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
        parserOptions,
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
        parserOptions,
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
    ],
  })
})
