# Sort destructuring keys (sort-destructuring-keys)

Ensures keys are sorted for object destructuring.

## Rule Details

Makes sure the keys from object destructuring are sorted properly.

The following patterns are not considered problems:

```js
/* eslint wyze/sort-destructuring-keys: 'error' */
const props = { a: 1, b: 2, B: 3 }

const { a, b } = props
const { B, a } = props
const { ['b'.toUpperCase()]: c, a } = props

/* eslint wyze/sort-destructuring-keys: ['error', 'desc'] */
const { b, a } = props
const { a, B } = props
const { ['b'.toUpperCase()]: c, B } = props

/* eslint wyze/sort-destructuring-keys: ['error', 'asc', { caseSensitive: false }] */
const { B, a } = props

/* eslint wyze/sort-destructuring-keys: ['error', 'asc', { ignoreComputed: true }] */
const { a, b, ['b'.toUpperCase()]: c } = props

/* eslint wyze/sort-destructuring-keys: ['error', 'asc', { ignoreDefaults: false }] */
const { b, a = b } = props
```

The following patterns are considered problems:

```js
/* eslint wyze/sort-destructuring-keys: 'error' */
const props = { a: 1, b: 2, B: 3 }

const { b, a } = props
const { a, B } = props
const { a, b, ['b'.toUpperCase()]: c } = props

/* eslint wyze/sort-destructuring-keys: ['error', 'desc'] */
const { a, b } = props
const { a, B } = props

/* eslint wyze/sort-destructuring-keys: ['error', 'asc', { caseSensitive: false }] */
const { B, a } = props
```


## Options

### `sortOrder`: enum ['asc', 'desc'] (default: 'asc')

Specify which way you would like the keys to be sorted.

> The next set of options are an object with the following properties.

### `{}.caseSensitive`: boolean (default: true)

Turn off case sensitivity sorting.

### `{}.ignoreDefaults`: boolean (default: true)

Include default values so some property may be placed before other properties.

### `{}.ignoreComputed`: boolean (default: false)

Ignore computed properties so they don't have to appear before other properties.

## When Not To Use It

You can turn this rule off if you are not concerned with the order of your destructuring keys.
