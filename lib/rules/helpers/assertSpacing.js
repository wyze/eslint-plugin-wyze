'use strict'

const maybeReportMissingSpace = require('./maybeReportToken').maybeReportMissingSpace
const maybeReportRequiredSpace = require('./maybeReportToken').maybeReportRequiredSpace

/**
 * Performs logic on the node to determine if it is valid.
 *
 * @param {ASTNode} node - the Statement (If/For/etc.) node
 */
const assertSpacing = ( context, getStart, getEnd, assertMissing ) => {
  const sc = context.getSourceCode()

  return node => {
    const start = getStart(node)
    const end = getEnd(node)
    const before = sc.getTokenBefore(start)
    const first = sc.getFirstToken(start)
    const after = sc.getTokenAfter(end)
    const last = sc.getLastToken(end)

    if ( assertMissing(first, last) ) {
      maybeReportMissingSpace(context, sc, node, 'after', before, first)
      maybeReportMissingSpace(context, sc, node, 'before', last, after)
    } else {
      maybeReportRequiredSpace(context, sc, node, 'after', before, first)
      maybeReportRequiredSpace(context, sc, node, 'before', last, after)
    }
  }
}

module.exports = assertSpacing
