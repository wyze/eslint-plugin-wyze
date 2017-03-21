# Function call argument spacing (func-call-arg-spacing)

Enforces spacing inside function call arguments.

> The `--fix` option on the command line can automatically fix some of the problems reported by this rule.

## Rule Details

The following patterns are not considered problems:

```js
const app = { use: () => {} }
const foo = ( a, b ) => {}

/* eslint wyze/func-call-arg-spacing: 'error' */
foo(1, 2)

foo(
  1,
  2,
)

app.use(( req, res ) => {})

[].filter(x => x)
```

The following patterns are considered problems:

```js
const app = { use: () => {} }
const foo = ( a, b ) => {}

/* eslint wyze/func-call-arg-spacing: 'error' */
foo( 1, 2 )

app.use( ( req, res ) => {} )

[].filter( x => x )
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing inside function call arguments.
