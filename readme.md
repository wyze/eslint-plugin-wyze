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

### [v3.3.1](https://github.com/wyze/eslint-plugin-wyze/releases/tag/v3.3.1) (2017-06-27)

* [[`9f0504d104`](https://github.com/wyze/eslint-plugin-wyze/commit/9f0504d104)] - Upgrade dependencies (Neil Kistner)
* [[`22bea1f744`](https://github.com/wyze/eslint-plugin-wyze/commit/22bea1f744)] - Ensure rest property is last in `sort-destructuring-keys` rule (Neil Kistner)
* [[`3f04cd2c66`](https://github.com/wyze/eslint-plugin-wyze/commit/3f04cd2c66)] - Fix bug in `sort-destructuring-keys` when 10+ keys are used (Neil Kistner)

## License

MIT © [Neil Kistner](https://neilkistner.com)

[travis-image]: https://img.shields.io/travis/wyze/eslint-plugin-wyze.svg?style=flat-square
[travis-url]: https://travis-ci.org/wyze/eslint-plugin-wyze

[npm-image]: https://img.shields.io/npm/v/eslint-plugin-wyze.svg?style=flat-square
[npm-url]: https://npmjs.com/package/eslint-plugin-wyze

[depsdev-image]: https://img.shields.io/david/dev/wyze/eslint-plugin-wyze.svg?style=flat-square
[depsdev-url]: https://david-dm.org/wyze/eslint-plugin-wyze?type=dev
