# Sort destructuring keys (sort-destructuring-keys)

Ensures keys are sorted for object destructuring.

## Rule Details

Makes sure the keys from object destructuring are sorted properly.

The following patterns are not considered problems:

```js
/* eslint wyze/sort-destructuring-keys: 2 */
const props = { a: 1, b: 2, B: 3 }

const { a, b } = props
const { B, a } = props
const { ['b'.toUpperCase()]: c, a } = props

/* eslint wyze/sort-destructuring-keys: [2, 'desc'] */
const { b, a } = props
const { a, B } = props
const { ['b'.toUpperCase()]: c, B } = props

/* eslint wyze/sort-destructuring-keys: [2, 'asc', { caseSensitive: false }] */
const { B, a } = props

/* eslint wyze/sort-destructuring-keys: [2, 'asc', { ignoreComputed: true }] */
const { a, b, ['b'.toUpperCase()]: c } = props
```

The following patterns are considered problems:

```js
/* eslint wyze/sort-destructuring-keys: 2 */
const props = { a: 1, b: 2, B: 3 }

const { b, a } = props
const { a, B } = props
const { a, b, ['b'.toUpperCase()]: c } = props

/* eslint wyze/sort-destructuring-keys: [2, 'desc'] */
const { a, b } = props
const { a, B } = props

/* eslint wyze/sort-destructuring-keys: [2, 'asc', { caseSensitive: false }] */
const { B, a } = props
```


## Options

### `sortOrder`: enum ['asc', 'desc'] (default: 'asc')

Specify which way you would like the keys to be sorted.

> The next set of options are an object with the following properties.

### `{}.caseSensitive`: boolean (default: true)

Turn off case sensitivity sorting.

### `{}.ignoreComputed`: boolean (default: false)

Ignore computed properties so they don't have to appear before other properties.

## When Not To Use It

You can turn this rule off if you are not concerned with the order of your destructuring keys.
