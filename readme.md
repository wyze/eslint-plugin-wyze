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
* [sort-imports](docs/rules/sort-imports.md): Sorts imports by `named` and `default`.
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

### [v3.1.0](https://github.com/wyze/eslint-plugin-wyze/releases/tag/v3.1.0) (2017-03-22)

* [[`04c7514816`](https://github.com/wyze/eslint-plugin-wyze/commit/04c7514816)] - Exclude test files from npm package (Neil Kistner)
* [[`d5af4d8498`](https://github.com/wyze/eslint-plugin-wyze/commit/d5af4d8498)] - Document some functions in `sort-destructuring-keys` rule (Neil Kistner)
* [[`a5b65319ac`](https://github.com/wyze/eslint-plugin-wyze/commit/a5b65319ac)] - Fix false positives for `func-params-spacing` rule (Neil Kistner)
* [[`3c4fa82012`](https://github.com/wyze/eslint-plugin-wyze/commit/3c4fa82012)] - Change message for `newline-after-export` and make fixable (Neil Kistner)
* [[`4a092c914f`](https://github.com/wyze/eslint-plugin-wyze/commit/4a092c914f)] - Add fixer to spacing rules (Neil Kistner)
* [[`701e2dcca3`](https://github.com/wyze/eslint-plugin-wyze/commit/701e2dcca3)] - Fix edge case with `func-params-spacing` rule (Neil Kistner)
* [[`d0eab7e55e`](https://github.com/wyze/eslint-plugin-wyze/commit/d0eab7e55e)] - Fix bug in `sort-destructuring-keys` with rest object (Neil Kistner)
* [[`503ff728af`](https://github.com/wyze/eslint-plugin-wyze/commit/503ff728af)] - Fix bug in `func-params-spacing` with class methods (Neil Kistner)
* [[`9ce64d019f`](https://github.com/wyze/eslint-plugin-wyze/commit/9ce64d019f)] - Change build process again (Neil Kistner)

## License

MIT © [Neil Kistner](https://neilkistner.com)

[travis-image]: https://img.shields.io/travis/wyze/eslint-plugin-wyze.svg?style=flat-square
[travis-url]: https://travis-ci.org/wyze/eslint-plugin-wyze

[npm-image]: https://img.shields.io/npm/v/eslint-plugin-wyze.svg?style=flat-square
[npm-url]: https://npmjs.com/package/eslint-plugin-wyze

[depsdev-image]: https://img.shields.io/david/dev/wyze/eslint-plugin-wyze.svg?style=flat-square
[depsdev-url]: https://david-dm.org/wyze/eslint-plugin-wyze?type=dev
