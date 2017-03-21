'use strict'

const assertSpacing = require('./helpers/assertSpacing')
const maybeReportMissingSpace = require('./helpers/maybeReportToken').maybeReportMissingSpace

/**
 * ( a, b ) => {} --> space
 * ({ a, b }) => {} --> no space
 * ([ a, b ]) => {} --> no space
 * ( { a }, b ) => {} --> space
 * ({ a }, { b }) => {} --> no space
 * ([ a ], b, [ c ]) => {} --> no space
 * ([ a ], b, { c }) => {} --> no space
 * ( a: string ) => {} --> space
 * ( { a }: Props ) => {} --> space
 * ({ a }: { a: string }) => {} --> no space
 */

module.exports = {
  meta: {
    fixable: 'whitespace',
  },
  create( context ) {
    const sc = context.getSourceCode()

    /**
     * Checks params for destructuring in the first and last param.
     *
     * @param {Token} first - the first token
     * @param {Token} last - the last token
     */
    const isParamDestructuring = ( first, last ) => /^(\[|\]|\{|\}){2}$/.test(`${first}${last}`)

    /**
     * Finds index of first paren token.
     *
     * @param {Token[]} tokens - Array of token objects.
     * @returns {Number} Index of first paren.
     */
    const getFirstParenIndex = tokens =>
      tokens.findIndex(token => token.type === 'Punctuator' && token.value === '(')

    /**
     * Performs logic on the node to determine if it is valid.
     *
     * @param {ASTNode} node - the Statement (If/For/etc.) node
     */
    const assertParamsSpacing = assertSpacing(
      context,
      node => node.params.slice(0, 1).pop(),
      node => node.params.slice(-1).pop(),
      ( first, last ) => isParamDestructuring(first.value, last.value)
    )

    /**
     * Checks whether or not a node is an argument.
     * @param {ASTNode} node - A node to check.
     * @returns {boolean} Whether or not the node is an argument.
     */
    const isArgument = node =>
      node.parent.type === 'CallExpression' && node.parent.arguments.indexOf(node) > -1

    /**
     * Performs logic on the node to determine if it is valid.
     *
     * @param {ASTNode} node - the Statement (If/For/etc.) node
     */
    const assertStatement = node => {
      if ( !node.params.length ) {
        const tokens = sc.getTokens(node)
        const index = getFirstParenIndex(tokens)
        const firstParen = tokens[index]
        const secondParen = tokens[index + 1]

        maybeReportMissingSpace(context, sc, node, 'after', firstParen, secondParen)

        return
      }

      if ( isArgument(node) && node.params.length === 1 ) {
        return
      }

      assertParamsSpacing(node)
    }

    return {
      ArrowFunctionExpression: assertStatement,
      FunctionDeclaration: assertStatement,
      FunctionExpression: assertStatement,
    }
  },
}
