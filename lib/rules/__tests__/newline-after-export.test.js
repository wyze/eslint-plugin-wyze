import { CLIEngine, RuleTester } from 'eslint'
import rule from '../newline-after-export'

const parserOptions = {
  ecmaVersion: 2017,
  sourceType: 'module',
}
const message = 'Expected newline after export statement.'

describe('newline-after-export', () => {
  it('passes RuleTester', () => {
    new RuleTester().run('newline-after-export', rule, {
      valid: [
        {
          code:
          `
          export const a = 1;
          export const b = 2;

          export default { a, b };
          `,
          parserOptions,
        },
      ],
      invalid: [
        {
          code:
          `
          export const a = 1;
          const b = 1;
          `,
          errors: [
            { message },
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
        'wyze/newline-after-export': 'error',
      },
      useEslintrc: false,
    })
    const fixture = name => [ `fixtures/newline-after-export/${name}.js` ]
    const title = name => `newline-after-export applies fixes to ${name} export`

    expect(cli.executeOnFiles(fixture('default')))
      .toMatchSnapshot(title('default'))

    expect(cli.executeOnFiles(fixture('named')))
      .toMatchSnapshot(title('named'))
  })
})
