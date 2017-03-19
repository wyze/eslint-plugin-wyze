# eslint-plugin-wyze

[![Build Status][travis-image]][travis-url]
[![npm][npm-image]][npm-url]
[![devDependencies][depsdev-image]][depsdev-url]

> My personal [ESLint](//github.com/eslint/eslint) rules.

## Installation

There is a `peerDependencies` on `eslint`.

```shell
$ npm i --save-dev eslint-plugin-wyze eslint
```

## Usage

### package.json

```js
{
  // ...
  "eslintConfig": {
    "plugins": [
      "wyze"
    ]
  }
}
```

### .eslintrc

```js
{
  "plugins": [
    "wyze"
  ]
}
```

## Supported Rules

* [func-call-arg-spacing](docs/rules/func-call-arg-spacing.md): Enforces spacing inside function call arguments.
* [func-params-spacing](docs/rules/func-params-spacing.md): Enforces spacing inside function parameters.
* [max-file-length](docs/rules/max-file-length.md): Keep files to a maximum length.
* [newline-after-export](docs/newline-after-export.md): Ensures `export` statements are followed by a newline.
* [sort-destructuring-keys](docs/rules/sort-destructuring-keys.md): Ensures keys are sorted for object destructuring.
* [sort-imports](docs/rules/sort-imports.md): Sorts imports by `named` and `default`.
* [space-around-conditional](docs/rules/space-around-conditional.md): Always put spacing around your conditional expressions.

## Recommended Config

We support a recommended config for the rules.

### Enable

```js
{
  "extends": "plugin:wyze/recommended",
  "plugins": [
    "wyze"
  ]
}
```

### Rules

```js
{
  "rules": {
    "wyze/func-call-arg-spacing": "error",
    "wyze/func-params-spacing": "error",
    "wyze/max-file-length": "error",
    "wyze/newline-after-export": "error",
    "wyze/sort-destructuring-keys": "error",
    "wyze/sort-imports": "error",
    "wyze/space-around-conditional": "error"
  }
}
```

## Change Log

> [Full Change Log](changelog.md)

### [v3.0.0](https://github.com/wyze/eslint-plugin-wyze/releases/tag/v3.0.0) (2017-03-19)

* [[`5874cea542`](https://github.com/wyze/eslint-plugin-wyze/commit/5874cea542)] - Add `func-call-arg-spacing` rule (Neil Kistner)
* [[`a7858d4604`](https://github.com/wyze/eslint-plugin-wyze/commit/a7858d4604)] - Add past changelog and changelog build script (Neil Kistner)
* [[`b4840a2ea1`](https://github.com/wyze/eslint-plugin-wyze/commit/b4840a2ea1)] - Fix edge case in `space-around-conditional` rule (Neil Kistner)
* [[`3582af3cd2`](https://github.com/wyze/eslint-plugin-wyze/commit/3582af3cd2)] - Make spacing checks into helper functions (Neil Kistner)
* [[`a480a5d6a0`](https://github.com/wyze/eslint-plugin-wyze/commit/a480a5d6a0)] - Add `func-params-spacing` rule (Neil Kistner)
* [[`81ee64af21`](https://github.com/wyze/eslint-plugin-wyze/commit/81ee64af21)] - Restructure tests (Neil Kistner)
* [[`f34279b5e4`](https://github.com/wyze/eslint-plugin-wyze/commit/f34279b5e4)] - Upgrade lint rules and fix lint errors (Neil Kistner)
* [[`ac484103ef`](https://github.com/wyze/eslint-plugin-wyze/commit/ac484103ef)] - Add flow type sorting to `sort-imports` rule (Neil Kistner)
* [[`ccca3e30e8`](https://github.com/wyze/eslint-plugin-wyze/commit/ccca3e30e8)] - Update travis config to fix build (Neil Kistner)
* [[`e4bf84c455`](https://github.com/wyze/eslint-plugin-wyze/commit/e4bf84c455)] - Run ESLint against codebase (Neil Kistner)
* [[`ef6aa44f56`](https://github.com/wyze/eslint-plugin-wyze/commit/ef6aa44f56)] - Enhance the `space-around-conditional` rule (Neil Kistner)
* [[`60c202823c`](https://github.com/wyze/eslint-plugin-wyze/commit/60c202823c)] - Refactor `space-around-conditional` rule to use ESLint api (Neil Kistner)
* [[`8c1e5945f8`](https://github.com/wyze/eslint-plugin-wyze/commit/8c1e5945f8)] - Drop support for Node \< 4 (Neil Kistner)
* [[`8992b41f9a`](https://github.com/wyze/eslint-plugin-wyze/commit/8992b41f9a)] - Convert to new eslint rule config syntax (Neil Kistner)
* [[`e22a9eff75`](https://github.com/wyze/eslint-plugin-wyze/commit/e22a9eff75)] - Upgrade dependencies and add yarn (Neil Kistner)
* [[`ba0df49e53`](https://github.com/wyze/eslint-plugin-wyze/commit/ba0df49e53)] - Add `sort-destructuring-keys` rule (Neil Kistner)
* [[`1c563b3b9a`](https://github.com/wyze/eslint-plugin-wyze/commit/1c563b3b9a)] - Meta file updates (Neil Kistner)
* [[`e8dd6f687a`](https://github.com/wyze/eslint-plugin-wyze/commit/e8dd6f687a)] - Upgrade ava dependency (Neil Kistner)

## License

MIT © [Neil Kistner](https://neilkistner.com)

[travis-image]: https://img.shields.io/travis/wyze/eslint-plugin-wyze.svg?style=flat-square
[travis-url]: https://travis-ci.org/wyze/eslint-plugin-wyze

[npm-image]: https://img.shields.io/npm/v/eslint-plugin-wyze.svg?style=flat-square
[npm-url]: https://npmjs.com/package/eslint-plugin-wyze

[depsdev-image]: https://img.shields.io/david/dev/wyze/eslint-plugin-wyze.svg?style=flat-square
[depsdev-url]: https://david-dm.org/wyze/eslint-plugin-wyze?type=dev
