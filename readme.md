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

* [func-call-arg-spacing](docs/rules/func-call-arg-spacing.md): Enforces spacing inside function call arguments. _(fixable)_
* [func-params-spacing](docs/rules/func-params-spacing.md): Enforces spacing inside function parameters. _(fixable)_
* [max-file-length](docs/rules/max-file-length.md): Keep files to a maximum length.
* [newline-after-export](docs/newline-after-export.md): Ensures `export` statements are followed by a newline. _(fixable)_
* [sort-destructuring-keys](docs/rules/sort-destructuring-keys.md): Ensures keys are sorted for object destructuring.
* [sort-imports](docs/rules/sort-imports.md): Sorts imports by `named` and `default`. _(fixable)_
* [space-around-conditional](docs/rules/space-around-conditional.md): Always put spacing around your conditional expressions. _(fixable)_

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

### [v3.2.0](https://github.com/wyze/eslint-plugin-wyze/releases/tag/v3.2.0) (2017-03-26)

* [[`d73bc26394`](https://github.com/wyze/eslint-plugin-wyze/commit/d73bc26394)] - Add filepath serializer to Jest to make snapshots valid on Travis (Neil Kistner)
* [[`72c04f70ac`](https://github.com/wyze/eslint-plugin-wyze/commit/72c04f70ac)] - Upgrade dependencies (Neil Kistner)
* [[`9969920a30`](https://github.com/wyze/eslint-plugin-wyze/commit/9969920a30)] - Add snapshot tests for `sort-import` rule fixes (Neil Kistner)
* [[`ace0a759ed`](https://github.com/wyze/eslint-plugin-wyze/commit/ace0a759ed)] - Add snapshot tests for `--fix` tests (Neil Kistner)
* [[`94c9adf380`](https://github.com/wyze/eslint-plugin-wyze/commit/94c9adf380)] - Switch to Jest for testing (Neil Kistner)
* [[`8a63051086`](https://github.com/wyze/eslint-plugin-wyze/commit/8a63051086)] - Make sort-imports fix the sort order (#10) (Justin Anastos)

## License

MIT © [Neil Kistner](https://neilkistner.com)

[travis-image]: https://img.shields.io/travis/wyze/eslint-plugin-wyze.svg?style=flat-square
[travis-url]: https://travis-ci.org/wyze/eslint-plugin-wyze

[npm-image]: https://img.shields.io/npm/v/eslint-plugin-wyze.svg?style=flat-square
[npm-url]: https://npmjs.com/package/eslint-plugin-wyze

[depsdev-image]: https://img.shields.io/david/dev/wyze/eslint-plugin-wyze.svg?style=flat-square
[depsdev-url]: https://david-dm.org/wyze/eslint-plugin-wyze?type=dev
