# Max file length (max-file-length)

Keep files to a maximum length.

## Rule Details

Checks the line length of files to make sure it is under the maximum length allowed.

The following patterns are not considered problems:

```js
/* eslint wyze/max-file-length: 'error' */
if ( true ) {
  // Do something...
}

for ( var i = 0; i < 10; i++ ) {
  // Do something...
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
```

The following patterns are considered problems:

```js
/* eslint wyze/max-file-length: ['error', 15] */
if ( true ) {
  // Do something...
}

for ( var i = 0; i < 10; i++ ) {
  // Do something...
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
```


## Options

### `maxLines`: number (default: 200)

Specify the number of lines you would like files to be under.

## When Not To Use It

You can turn this rule off if you are not concerned with the length of your files.
