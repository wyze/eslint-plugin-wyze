# Spacing around conditional expressions (space-around-conditional)

Always put spacing around your conditional expressions.

## Rule Details

This rule is more granular than [space-in-parens](http://eslint.org/docs/rules/space-in-parens). This rule is limited to conditional expressions in control flow statements only. `If`, `For`, `While`, etc.

The following patterns are not considered problems:

```js
/* eslint wyze/space-around-conditional: 'error' */
if ( true ) {
  // Do something...
}

for ( var i = 0; i < 10; i++ ) {
  // Do something...
}

for ( ;; ) {
  // Do something
}

while ( true ) {
  // Do something...
}

do {
  // Do something...
} while ( true )

switch ( true ) {
  // Do something...
}

for ( const letter of 'hello' ) {
  // Do something...
}

for ( const prop in {} ) {
  // Do something...
}

try {
  // Do something...
} catch ( ex ) {}
```

The following patterns are considered problems:

```js
/* eslint wyze/space-around-conditional: 'error' */
if (true ) {
  // Do something...
}

for ( var i = 0; i < 10; i++) {
  // Do something...
}

while (true) {
  // Do something...
}

do {
  // Do something...
} while (true )

switch ( true) {
  // Do something...
}

for (const letter in 'hello') {
  // Do something...
}

for ( const prop of {}) {
  // Do something...
}

try {
  // Do something...
} catch (ex) {}
```

## When Not To Use It

You can turn this rule off if you are not concerned with the consistency of spacing between parentheses.
