'use strict'

const assertSpacing = require('./helpers/assertSpacing')
const maybeReportRequiredSpace = require('./helpers/maybeReportToken').maybeReportRequiredSpace

module.exports = {
  meta: {
    fixable: 'whitespace',
  },
  create( context ) {
    const afterProps = [ 'init', 'test', 'left', 'param', 'discriminant' ]
    const beforeProps = [ 'update', 'test', 'right', 'param', 'discriminant' ]
    const sc = context.getSourceCode()

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
    const assertStatement = assertSpacing(
      context,
      node => getSubnode(node, afterProps),
      node => getSubnode(node, beforeProps),
      () => false
    )

    return {
      IfStatement( node ) {
        const firsts = sc.getFirstTokens(node, 3)
        const lasts = sc.getTokensAfter(node.test, 2)
        const first = firsts[1]
        const before = firsts[2]
        const after = lasts[0]
        const last = lasts[1]

        if ( first.value === before.value ) {
          maybeReportRequiredSpace(context, sc, node, 'after', first, before)
        }

        if ( after.value === last.value ) {
          maybeReportRequiredSpace(context, sc, node, 'before', after, last)
        }

        assertStatement(node)
      },
      ForInStatement: assertStatement,
      ForOfStatement: assertStatement,
      ForStatement( node ) {
        // Guard against for ( ;; ) {}
        if ( !node.init ) {
          const tokens = sc.getFirstTokens(node, 3)

          maybeReportRequiredSpace(context, sc, node, 'after', tokens[1], tokens[2])
        }

        if ( !node.update ) {
          const last = sc.getTokenBefore(node.body)
          const after = sc.getTokenBefore(last)

          maybeReportRequiredSpace(context, sc, node, 'before', after, last)
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
