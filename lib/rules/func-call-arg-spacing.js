'use strict'

const assertSpacing = require('./helpers/assertSpacing')
const { maybeReportMissingSpace } = require('./helpers/maybeReportToken')

module.exports = {
  meta: {
    fixable: 'whitespace',
  },
  create( context ) {
    const sc = context.getSourceCode()

    /**
     * Determines whether two adjacent tokens are on the same line.
     * @param {Object} left - The left token object.
     * @param {Object} right - The right token object.
     * @returns {boolean} Whether or not the tokens are on the same line.
     */
    const isTokenOnSameLine = ( left, right ) =>
      left.loc.end.line === right.loc.start.line

    /**
     * Performs logic on the node to determine if it is valid.
     *
     * @param {ASTNode} node - the Statement (If/For/etc.) node
     */
    const assertArgumentSpacing = assertSpacing(
      context,
      node => node.arguments.slice(0, 1).pop(),
      node => node.arguments.slice(-1).pop(),
      () => true
    )

    return {
      CallExpression( node ) {
        if ( !node.arguments.length ) {
          const tokens = sc.getTokens(node)

          maybeReportMissingSpace(context, sc, node, 'after', tokens[1], tokens[2])

          return
        } else if ( !isTokenOnSameLine(node.callee, node.arguments[0]) ) {
          return
        }

        assertArgumentSpacing(node)
      },
    }
  },
}
