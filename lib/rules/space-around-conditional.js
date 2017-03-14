'use strict'

module.exports = {
  meta: {},
  create( context ) {
    const sc = context.getSourceCode()

    /**
     * Performs logic on the node to determine if it is valid.
     *
     * @param {ASTNode} node - the Statement (If/For/etc.) node
     * @param {String} location - the Statement (If/For/etc.) node
     */
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
     * Maybe report about a required space.
     *
     * @param {ASTNode} node - the Statement (If/For/etc.) node
     * @param {String} location - before/after where space is
     * @param {Token} start - the beginning token
     * @param {Token} end - the ending token
     */
    const maybeReportRequiredSpace = ( node, location, start, end ) => {
      if ( !sc.isSpaceBetweenTokens(start, end) ) {
        report(node, location)
      }
    }

    /**
     * Performs logic on the node to determine if it is valid.
     *
     * @param {ASTNode} node - the Statement (If/For/etc.) node
     * @param {ASTNode} alternate - A SwitchStatement.discriminant node
     */
    const assertStatement = ( node, alternate ) => {
      const before = sc.getTokenBefore(alternate || node.init || node.test)
      const first = sc.getFirstToken(alternate || node.init || node.test)
      const after = sc.getTokenAfter(alternate || node.update || node.test)
      const last = sc.getLastToken(alternate || node.update || node.test)

      maybeReportRequiredSpace(node, 'after', before, first)
      maybeReportRequiredSpace(node, 'before', last, after)
    }

    return {
      IfStatement: assertStatement,
      ForStatement( node ) {
        // Guard against for ( ;; ) {}
        if ( !node.init ) {
          const tokens = sc.getFirstTokens(node, 3)

          maybeReportRequiredSpace(node, 'after', tokens[1], tokens[2])
        }

        if ( !node.update ) {
          const last = sc.getTokenBefore(node.body)
          const after = sc.getTokenBefore(last)

          maybeReportRequiredSpace(node, 'before', after, last)
        }

        if ( node.init && node.update ) {
          assertStatement(node)
        }
      },
      SwitchStatement( node ) {
        assertStatement(node, node.discriminant)
      },
      WhileStatement: assertStatement,
      DoWhileStatement: assertStatement,
    }
  },
}
