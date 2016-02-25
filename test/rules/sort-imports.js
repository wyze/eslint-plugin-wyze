import { RuleTester } from 'eslint'
import rule from '../../lib/rules/sort-imports'
import test from 'ava'

const parserOptions = {
  ecmaVersion: 6,
  sourceType: "module"
}
const expectedError = {
  message: "Imports should be sorted alphabetically.",
  type: "ImportDeclaration"
}
const ignoreCaseArgs = [{ ignoreCase: true }]

new RuleTester().run('sort-imports', rule, {
  valid: [
    {
        code:
            "import a from 'foo.js';\n" +
            "import b from 'bar.js';\n" +
            "import c from 'baz.js';\n",
        parserOptions: parserOptions
    },
    {
        code:
            "import * as B from 'foo.js';\n" +
            "import A from 'bar.js';",
        parserOptions: parserOptions
    },
    {
        code:
            "import * as B from 'foo.js';\n" +
            "import {a, b} from 'bar.js';",
        parserOptions: parserOptions
    },
    {
        code:
            "import {b, c} from 'bar.js';\n" +
            "import A from 'foo.js';",
        parserOptions: parserOptions
    },
    {
        code:
            "import A from 'bar.js';\n" +
            "import {b, c} from 'foo.js';",
        parserOptions: parserOptions,
        options: [{
            memberSyntaxSortOrder: [ "default", "named", "none", "all" ]
        }]
    },
    {
        code:
            "import {a, b} from 'bar.js';\n" +
            "import {b, c} from 'foo.js';",
        parserOptions: parserOptions
    },
    {
        code:
            "import A from 'foo.js';\n" +
            "import B from 'bar.js';",
        parserOptions: parserOptions
    },
    {
        code:
            "import A from 'foo.js';\n" +
            "import a from 'bar.js';",
        parserOptions: parserOptions
    },
    {
        code:
            "import a, * as b from 'foo.js';\n" +
            "import b from 'bar.js';",
        parserOptions: parserOptions
    },
    {
        code:
            "import 'foo.js';\n" +
            " import a from 'bar.js';",
        parserOptions: parserOptions
    },
    {
        code:
            "import B from 'foo.js';\n" +
            "import a from 'bar.js';",
        parserOptions: parserOptions
    },
    {
        code:
            "import a from 'foo.js';\n" +
            "import B from 'bar.js';",
        parserOptions: parserOptions,
        options: ignoreCaseArgs
    },
    {
        code: "import {a, b, c, d} from 'foo.js';",
        parserOptions: parserOptions
    },
    {
        code: "import {b, A, C, d} from 'foo.js';",
        parserOptions: parserOptions,
        options: [{
            ignoreMemberSort: true
        }]
    },
    {
        code: "import {B, a, C, d} from 'foo.js';",
        parserOptions: parserOptions,
        options: [{
            ignoreMemberSort: true
        }]
    },
    {
        code: "import {a, B, c, D} from 'foo.js';",
        parserOptions: parserOptions,
        options: ignoreCaseArgs
    },
    {
        code: "import a, * as b from 'foo.js';",
        parserOptions: parserOptions
    },
    {
        code:
            "import * as a from 'foo.js';\n" +
            "\n" +
            "import b from 'bar.js';",
        parserOptions: parserOptions
    },
    {
        code:
            "import * as bar from 'bar.js';\n" +
            "import * as foo from 'foo.js';",
        parserOptions: parserOptions
    },

    // https://github.com/eslint/eslint/issues/5130
    {
        code:
            "import 'foo';\n" +
            "import bar from 'bar';",
        parserOptions: parserOptions,
        options: ignoreCaseArgs
    },

    // https://github.com/eslint/eslint/issues/5305
    {
        code: "import React, {Component} from 'react';",
        parserOptions: parserOptions
    },

    {
        code:
            "import { bar } from 'bar.js';\n" +
            "import foo from 'foo.js';",
        parserOptions: parserOptions
    }
],
invalid: [
    {
        code:
            "import a from 'foo.js';\n" +
            "import A from 'bar.js';",
        parserOptions: parserOptions,
        errors: [expectedError]
    },
    {
        code:
            "import b from 'foo.js';\n" +
            "import a from 'bar.js';",
        parserOptions: parserOptions,
        errors: [expectedError]
    },
    {
        code:
            "import {b, c} from 'foo.js';\n" +
            "import {a, b} from 'bar.js';",
        parserOptions: parserOptions,
        errors: [expectedError]
    },
    {
        code:
            "import * as foo from 'foo.js';\n" +
            "import * as bar from 'bar.js';",
        parserOptions: parserOptions,
        errors: [expectedError]
    },
    {
        code:
            "import a from 'foo.js';\n" +
            "import {b, c} from 'bar.js';",
        parserOptions: parserOptions,
        errors: [{
            message: "Expected 'named' syntax before 'default' syntax.",
            type: "ImportDeclaration"
        }]
    },
    {
        code:
            "import a from 'foo.js';\n" +
            "import * as b from 'bar.js';",
        parserOptions: parserOptions,
        errors: [{
            message: "Expected 'all' syntax before 'default' syntax.",
            type: "ImportDeclaration"
        }]
    },
    {
        code:
            "import a from 'foo.js';\n" +
            "import 'bar.js';",
        parserOptions: parserOptions,
        errors: [{
            message: "Expected 'none' syntax before 'default' syntax.",
            type: "ImportDeclaration"
        }]
    },
    {
        code:
            "import b from 'bar.js';\n" +
            "import * as a from 'foo.js';",
        parserOptions: parserOptions,
        options: [{
            memberSyntaxSortOrder: [ "all", "default", "named", "none" ]
        }],
        errors: [{
            message: "Expected 'all' syntax before 'default' syntax.",
            type: "ImportDeclaration"
        }]
    },
    {
        code: "import {b, a, d, c} from 'foo.js';",
        parserOptions: parserOptions,
        errors: [{
            message: "Member 'a' of the import declaration should be sorted alphabetically.",
            type: "ImportSpecifier"
        }, {
            message: "Member 'c' of the import declaration should be sorted alphabetically.",
            type: "ImportSpecifier"
        }]
    },
    {
        code: "import {a, B, c, D} from 'foo.js';",
        parserOptions: parserOptions,
        errors: [{
            message: "Member 'B' of the import declaration should be sorted alphabetically.",
            type: "ImportSpecifier"
        }, {
            message: "Member 'D' of the import declaration should be sorted alphabetically.",
            type: "ImportSpecifier"
        }]
    }
]
})

test(async t => t.pass())
