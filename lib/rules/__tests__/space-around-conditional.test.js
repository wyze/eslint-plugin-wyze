/* eslint-disable wyze/max-file-length */
import { CLIEngine, RuleTester } from 'eslint'
import rule from '../space-around-conditional'

const parserOptions = {
  ecmaVersion: 2017,
  sourceType: 'module',
}
const expectedError = ( loc, type, suffix = 'Statement' ) => ({
  message: `A space is required ${loc} '${loc === 'after' ? '(' : ')'}'.`,
  type: `${type}${suffix}`,
})

describe('space-around-conditional', () => {
  it('passes RuleTester', () => {
    new RuleTester().run('space-around-conditional', rule, {
      valid: [
        {
          code:
            `
            if ( 1 + 1 === 2 && true ) {
              // Do something...
            }
            `,
        },
        {
          code:
            `
            if (
              1 + 1 === 2 && true
            ) {
              // Do something...
            }
            `,
        },
        {
          code:
            `
            for ( var i = 0; i < 10; i++ ) {
              // Do something...
            }
            `,
        },
        {
          code:
            `
            for ( ;; ) {
              // Do something...
            }
            `,
        },
        {
          code:
            `
            for ( ;true; ) {
              // Do something...
            }
            `,
        },
        {
          code:
            `
            while ( true ) {
              // Do something...
            }
            `,
        },
        {
          code:
            `
            do {
              // Do something...
            } while ( true )
            `,
        },
        {
          code:
          `
          switch ( true ) {
            // Do something...
          }
          `,
        },
        {
          code:
          `
          for ( const letter of 'hello' ) {
            // Do something...
          }
          `,
          parserOptions,
        },
        {
          code:
          `
          for ( const prop in {} ) {
            // Do something...
          }
          `,
          parserOptions,
        },
        {
          code:
          `
          try {
            // Do something...
          } catch ( ex ) {}
          `,
          parserOptions,
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
            expectedError('after', 'If'),
          ],
        },
        {
          code:
            `
            if ( true) {
              // Do something...
            }
            `,
          errors: [
            expectedError('before', 'If'),
          ],
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
            expectedError('before', 'If'),
          ],
        },
        {
          code:
          `
          if (( a = true )) {
            // Do something...
          }
          `,
          errors: [
            expectedError('after', 'If'),
            expectedError('before', 'If'),
          ],
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
            expectedError('after', 'If'),
          ],
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
            expectedError('before', 'If'),
          ],
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
            expectedError('before', 'If'),
          ],
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
            expectedError('before', 'If'),
          ],
        },
        {
          code:
            `
            for (var i = 0; i < 1; i++ ) {
              // Do something...
            }
            `,
          errors: [
            expectedError('after', 'For'),
          ],
        },
        {
          code:
            `
            for ( var i = 0; i < 1; i++) {
              // Do something...
            }
            `,
          errors: [
            expectedError('before', 'For'),
          ],
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
            expectedError('before', 'For'),
          ],
        },
        {
          code:
            `
            for (;; ) {
              // Do something...
            }
            `,
          errors: [
            expectedError('after', 'For'),
          ],
        },
        {
          code:
            `
            for ( ;;) {
              // Do something...
            }
            `,
          errors: [
            expectedError('before', 'For'),
          ],
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
            expectedError('before', 'For'),
          ],
        },
        {
          code:
            `
            while (true ) {
              // Do something...
            }
            `,
          errors: [
            expectedError('after', 'While'),
          ],
        },
        {
          code:
            `
            while ( true) {
              // Do something...
            }
            `,
          errors: [
            expectedError('before', 'While'),
          ],
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
            expectedError('before', 'While'),
          ],
        },
        {
          code:
            `
            do {
              // Do something...
            } while (true )
            `,
          errors: [
            expectedError('after', 'DoWhile'),
          ],
        },
        {
          code:
            `
            do {
              // Do something...
            } while ( true)
            `,
          errors: [
            expectedError('before', 'DoWhile'),
          ],
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
            expectedError('before', 'DoWhile'),
          ],
        },
        {
          code:
          `
          switch (true ) {
            // Do something...
          }
          `,
          errors: [
            expectedError('after', 'Switch'),
          ],
        },
        {
          code:
          `
          switch ( true) {
            // Do something...
          }
          `,
          errors: [
            expectedError('before', 'Switch'),
          ],
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
            expectedError('before', 'Switch'),
          ],
        },
        {
          code:
          `
          for (const letter of 'hello' ) {
            // Do something...
          }
          `,
          errors: [
            expectedError('after', 'ForOf'),
          ],
          parserOptions,
        },
        {
          code:
          `
          for ( const letter of 'hello') {
            // Do something...
          }
          `,
          errors: [
            expectedError('before', 'ForOf'),
          ],
          parserOptions,
        },
        {
          code:
          `
          for (const letter of 'hello') {
            // Do something...
          }
          `,
          errors: [
            expectedError('after', 'ForOf'),
            expectedError('before', 'ForOf'),
          ],
          parserOptions,
        },
        {
          code:
          `
          for (const prop in {} ) {
            // Do something...
          }
          `,
          errors: [
            expectedError('after', 'ForIn'),
          ],
          parserOptions,
        },
        {
          code:
          `
          for ( const prop in {}) {
            // Do something...
          }
          `,
          errors: [
            expectedError('before', 'ForIn'),
          ],
          parserOptions,
        },
        {
          code:
          `
          for (const prop in {}) {
            // Do something...
          }
          `,
          errors: [
            expectedError('after', 'ForIn'),
            expectedError('before', 'ForIn'),
          ],
          parserOptions,
        },
        {
          code:
          `
          try {
            // Do something...
          } catch (ex ) {}
          `,
          errors: [
            expectedError('after', 'Catch', 'Clause'),
          ],
          parserOptions,
        },
        {
          code:
          `
          try {
            // Do something...
          } catch ( ex) {}
          `,
          errors: [
            expectedError('before', 'Catch', 'Clause'),
          ],
          parserOptions,
        },
        {
          code:
          `
          try {
            // Do something...
          } catch (ex) {}
          `,
          errors: [
            expectedError('after', 'Catch', 'Clause'),
            expectedError('before', 'Catch', 'Clause'),
          ],
          parserOptions,
        },
      ],
    })
  })

  it('applies fixes', () => {
    const cli = new CLIEngine({
      cwd: __dirname,
      fix: true,
      parserOptions,
      plugins: [
        'wyze',
      ],
      rulePaths: [ '..' ],
      rules: {
        'wyze/space-around-conditional': 'error',
      },
      useEslintrc: false,
    })
    const fixture = name => [ `fixtures/space-around-conditional/${name}.js` ]
    const title = name => `space-around-conditional applies fixes to ${name} statement`

    expect(cli.executeOnFiles(fixture('do-statement')))
      .toMatchSnapshot(title('do'))

    expect(cli.executeOnFiles(fixture('for-in-statement')))
      .toMatchSnapshot(title('for..in'))

    expect(cli.executeOnFiles(fixture('for-of-statement')))
      .toMatchSnapshot(title('for..of'))

    expect(cli.executeOnFiles(fixture('for-statement')))
      .toMatchSnapshot(title('for'))

    expect(cli.executeOnFiles(fixture('if-statement')))
      .toMatchSnapshot(title('if'))

    expect(cli.executeOnFiles(fixture('switch-statement')))
      .toMatchSnapshot(title('switch'))

    expect(cli.executeOnFiles(fixture('try-catch-statement')))
      .toMatchSnapshot(title('try..catch'))

    expect(cli.executeOnFiles(fixture('while-statement')))
      .toMatchSnapshot(title('while'))
  })
})
