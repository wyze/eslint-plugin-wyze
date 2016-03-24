import { RuleTester } from 'eslint'
import rule from '../../lib/rules/space-around-conditional'
import test from 'ava'

const expectedError = ( loc, type ) => ({
  message: `There must be a space ${loc} this paren.`,
  type: `${type}Statement`,
})

test(() => {
  new RuleTester().run('space-around-conditional', rule, {
    valid: [
      {
        code:
          `
          if ( 1 + 1 === 2 && true ) {
            // Do something...
          }
          `
      },
      {
        code:
          `
          for ( var i = 0; i < 10; i++ ) {
            // Do something...
          }
          `
      },
      {
        code:
          `
          for ( ;; ) {
            // Do something...
          }
          `
      },
      {
        code:
          `
          while ( true ) {
            // Do something...
          }
          `
      },
      {
        code:
          `
          do {
            // Do something...
          } while ( true )
          `
      },
      {
        code:
        `
        switch ( true ) {
          // Do something...
        }
        `
      },
    ],
    invalid: [
      {
        code:
          `
          if (true ) {
            // Do something...
          }
          `,
        errors: [
          expectedError('after', 'If')
        ]
      },
      {
        code:
          `
          if ( true) {
            // Do something...
          }
          `,
        errors: [
          expectedError('before', 'If')
        ]
      },
      {
        code:
          `
          if (true) {
            // Do something...
          }
          `,
        errors: [
          expectedError('after', 'If'),
          expectedError('before', 'If')
        ]
      },
      {
        code:
          `
          if (true) {
            // Do something...
          }
          `,
        errors: [
          expectedError('after', 'If'),
          expectedError('before', 'If')
        ]
      },
      {
        code:
          `
          if (true ) {
            // Do something...
          } else if (true ) {
            // Do something else...
          }
          `,
        errors: [
          expectedError('after', 'If'),
          expectedError('after', 'If')
        ]
      },
      {
        code:
          `
          if ( true) {
            // Do something...
          } else if ( true) {
            // Do something else...
          }
          `,
        errors: [
          expectedError('before', 'If'),
          expectedError('before', 'If')
        ]
      },
      {
        code:
          `
          if (true) {
            // Do something...
          } else if (true) {
            // Do something else...
          }
          `,
        errors: [
          expectedError('after', 'If'),
          expectedError('before', 'If'),
          expectedError('after', 'If'),
          expectedError('before', 'If')
        ]
      },
      {
        code:
          `
          if (true) {
            // Do something...
          }
          `,
        errors: [
          expectedError('after', 'If'),
          expectedError('before', 'If')
        ]
      },
      {
        code:
          `
          for (var i = 0; i < 1; i++ ) {
            // Do something...
          }
          `,
        errors: [
          expectedError('after', 'For')
        ]
      },
      {
        code:
          `
          for ( var i = 0; i < 1; i++) {
            // Do something...
          }
          `,
        errors: [
          expectedError('before', 'For')
        ]
      },
      {
        code:
          `
          for (var i = 0; i < 1; i++) {
            // Do something...
          }
          `,
        errors: [
          expectedError('after', 'For'),
          expectedError('before', 'For')
        ]
      },
      {
        code:
          `
          for (;; ) {
            // Do something...
          }
          `,
        errors: [
          expectedError('after', 'For')
        ]
      },
      {
        code:
          `
          for ( ;;) {
            // Do something...
          }
          `,
        errors: [
          expectedError('before', 'For')
        ]
      },
      {
        code:
          `
          for (;;) {
            // Do something...
          }
          `,
        errors: [
          expectedError('after', 'For'),
          expectedError('before', 'For')
        ]
      },
      {
        code:
          `
          while (true ) {
            // Do something...
          }
          `,
        errors: [
          expectedError('after', 'While')
        ]
      },
      {
        code:
          `
          while ( true) {
            // Do something...
          }
          `,
        errors: [
          expectedError('before', 'While')
        ]
      },
      {
        code:
          `
          while (true) {
            // Do something...
          }
          `,
        errors: [
          expectedError('after', 'While'),
          expectedError('before', 'While')
        ]
      },
      {
        code:
          `
          do {
            // Do something...
          } while (true )
          `,
        errors: [
          expectedError('after', 'DoWhile')
        ]
      },
      {
        code:
          `
          do {
            // Do something...
          } while ( true)
          `,
        errors: [
          expectedError('before', 'DoWhile')
        ]
      },
      {
        code:
          `
          do {
            // Do something...
          } while (true)
          `,
        errors: [
          expectedError('after', 'DoWhile'),
          expectedError('before', 'DoWhile')
        ]
      },
      {
        code:
        `
        switch (true ) {
          // Do something...
        }
        `,
        errors: [
          expectedError('after', 'Switch')
        ]
      },
      {
        code:
        `
        switch ( true) {
          // Do something...
        }
        `,
        errors: [
          expectedError('before', 'Switch')
        ]
      },
      {
        code:
        `
        switch (true) {
          // Do something...
        }
        `,
        errors: [
          expectedError('after', 'Switch'),
          expectedError('before', 'Switch')
        ]
      },
    ]
  })
})
