'use strict'

module.exports = {
  meta: {},
  create( context ) {
    const sc = context.getSourceCode()

    /**
     * Performs logic on the node to determine if it is valid.
     *
     * @param {ASTNode} node - the Statement (If/For/etc.) node
     * @param {String} location - 'before' / 'after'
     * @param {Token} token - token of the paren
     */
    const report = ( node, location, token ) => {
      context.report({
        node,
        loc: token.loc.start,
        message: "A space is required {{location}} '{{tokenValue}}'.",
        data: {
          location,
          tokenValue: token.value,
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
        report(node, location, location === 'after' ? start : end)
      }
    }

    /**
     * Maybe report about a required space.
     *
     * @param {ASTNode} node - the Statement (If/For/etc.) node
     * @param {String[]} props - props to check for value on the node
     */
    const getSubnode = ( node, props ) =>
      props.reduce(( memo, prop ) => memo || node[prop], null)

    /**
     * Performs logic on the node to determine if it is valid.
     *
     * @param {ASTNode} node - the Statement (If/For/etc.) node
     */
    const assertStatement = node => {
      const afterProps = [ 'init', 'test', 'left', 'param', 'discriminant' ]
      const beforeProps = [ 'update', 'test', 'right', 'param', 'discriminant' ]
      const before = sc.getTokenBefore(getSubnode(node, afterProps))
      const first = sc.getFirstToken(getSubnode(node, afterProps))
      const after = sc.getTokenAfter(getSubnode(node, beforeProps))
      const last = sc.getLastToken(getSubnode(node, beforeProps))

      maybeReportRequiredSpace(node, 'after', before, first)
      maybeReportRequiredSpace(node, 'before', last, after)
    }

    return {
      IfStatement: assertStatement,
      ForInStatement: assertStatement,
      ForOfStatement: assertStatement,
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
      SwitchStatement: assertStatement,
      WhileStatement: assertStatement,
      DoWhileStatement: assertStatement,
      CatchClause: assertStatement,
    }
  },
}
