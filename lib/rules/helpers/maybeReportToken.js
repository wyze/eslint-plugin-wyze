'use strict'

const reportMissing = require('./reportToken').reportMissing
const reportRequired = require('./reportToken').reportRequired

/**
 * Maybe report about a missing space.
 *
 * @param {ASTNode} node - the Statement (If/For/etc.) node
 * @param {String} location - before/after where space is
 * @param {Token} start - the beginning token
 * @param {Token} end - the ending token
 */
const maybeReportMissingSpace = ( context, sc, node, location, start, end ) => {
  if ( sc.isSpaceBetweenTokens(start, end) ) {
    reportMissing(context, node, location, location === 'after' ? start : end)
  }
}

/**
 * Maybe report about a required space.
 *
 * @param {ASTNode} node - the Statement (If/For/etc.) node
 * @param {String} location - before/after where space is
 * @param {Token} start - the beginning token
 * @param {Token} end - the ending token
 */
const maybeReportRequiredSpace = ( context, sc, node, location, start, end ) => {
  if ( !sc.isSpaceBetweenTokens(start, end) ) {
    reportRequired(context, node, location, location === 'after' ? start : end)
  }
}

module.exports = {
  maybeReportMissingSpace,
  maybeReportRequiredSpace,
}
