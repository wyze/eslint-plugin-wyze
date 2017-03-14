'use strict'

module.exports = {
  meta: {},
  create( context ) {
    const sc = context.getSourceCode()
    const getTokenByRangeStart = sc.getTokenByRangeStart
    const getTokensAfter = sc.getTokensAfter

    const report = ( node, location ) => {
      context.report({
        node,
        message: 'There must be a space {{location}} this paren.',
        data: {
          location,
        },
      })
    }

    /**
     * Determines if a space is adjacent to a `(` or `)`.
     *
     * @param {Token} token - the Punctuator token
     * @returns {Bool} true if no space adjacent
     */
    const noSpaceAdjacentParen = token =>
      getTokenByRangeStart(token.end) !== null

    /**
     * Performs logic on the node to determine if it is valid.
     *
     * @param {ASTNode} node - the Statement (If/For/etc.) node
     */
    const assertStatement = node => {
      const token = getTokenByRangeStart(node.start)

      if ( noSpaceAdjacentParen(findParen(token)) ) {
        report(node, 'after')
      }

      if ( node.update || node.test ) {
        if ( noSpaceAdjacentParen(node.update || node.test) ) {
          report(node, 'before')
        }
      } else {
        const closing = getTokensAfter(token, 4).slice(-1).pop()

        if ( getTokenByRangeStart(closing.start - 1) !== null ) {
          report(node, 'before')
        }
      }
    }

    /**
     * Gets the token for the opening parenthesis.
     *
     * @param {Token} token - the Statement (If/For/etc.) token.
     * @returns {Token} location of the `Punctuator` token for `(`
     */
    const findParen = token => {
      const possible = getTokenByRangeStart(token.end)

      if ( !possible ) {
        return getTokenByRangeStart(token.end + 1)
      }

      return possible
    }

    return {
      IfStatement: assertStatement,
      ForStatement: assertStatement,
      SwitchStatement( node ) {
        const token = getTokenByRangeStart(node.start)

        if ( noSpaceAdjacentParen(findParen(token)) ) {
          report(node, 'after')
        }

        if ( noSpaceAdjacentParen(node.discriminant) ) {
          report(node, 'before')
        }
      },
      WhileStatement: assertStatement,
      DoWhileStatement( node ) {
        if ( getTokenByRangeStart(node.test.start - 1) ) {
          report(node, 'after')
        }

        if ( noSpaceAdjacentParen(node.update || node.test) ) {
          report(node, 'before')
        }
      },
    }
  },
}
