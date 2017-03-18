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
  meta: {},
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
     * Gets the index location for the first paren.
     *
     * @param {String} type - the type of the node
     */
    const getParenTokenIndex = type => {
      if ( type === 'ArrowFunctionExpression' ) {
        return 0
      }

      if ( type === 'FunctionExpression' ) {
        return 1
      }

      return 2
    }

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
     * Performs logic on the node to determine if it is valid.
     *
     * @param {ASTNode} node - the Statement (If/For/etc.) node
     */
    const assertStatement = node => {
      if ( !node.params.length ) {
        const tokens = sc.getTokens(node)
        const index = getParenTokenIndex(node.type)
        const firstParen = tokens[index]
        const secondParen = tokens[index + 1]

        maybeReportMissingSpace(context, sc, node, 'after', firstParen, secondParen)

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
