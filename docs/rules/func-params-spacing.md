# Function parameter spacing (func-params-spacing)

Enforces spacing inside function parameters.

> The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

## Rule Details

The following patterns are not considered problems:

```js
/* eslint wyze/func-params-spacing: 'error' */
const foo = ( a, b ) => {}

const foo = ({ a, b }) => {}

const foo = ([ a, b ]) => {}

const foo = ( { a }, b ) => {}

const foo = ({ a }, { b }) => {}

const foo = ([ a ], b, [ c ]) => {}

const foo = ([ a ], b, { c }) => {}

const foo = () => {}

const foo = a => {}

const a = ({
  b,
  c,
}) => {}

const foo = ( a: string ) => {}

const foo = ( { a }: Props ) => {}

const foo = ({ a }: { a: string }) => {}
```

The following patterns are considered problems:

```js
/* eslint wyze/func-params-spacing: 'error' */
function foo( a, b, c) {}

function foo(a, b, c) {}

const foo = function(a, b, c ) {}

const foo = ( a, b, c) => {}

const foo = (a, b, c) => {}

const foo = ({ a } ) => {}

const foo = ( { a } ) => {}

const foo = ({ a }, b ) => {}

const foo = ( { a }, b, [ c ] ) => {}

const foo = ( {
  a
}) => {}

const foo = ( ) => {}

const foo = (a: string ) => {}

const foo = ( { a }: { a: string }) => {}
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing inside function parameters.
