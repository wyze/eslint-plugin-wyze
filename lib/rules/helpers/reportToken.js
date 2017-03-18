'use strict'

/**
 * Reports that the node is not valid.
 *
 * @param {ASTNode} node - the Statement (If/For/etc.) node
 * @param {String} location - 'before' / 'after'
 * @param {Token} token - token of the paren
 */
const reportRequired = ( context, node, location, token ) => {
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
 * Report that the node is not valid.
 *
 * @param {ASTNode} node - the Statement (If/For/etc.) node
 * @param {String} location - 'before' / 'after'
 * @param {Token} token - token of the paren
 */
const reportMissing = ( context, node, location, token ) => {
  context.report({
    node,
    loc: token.loc.start,
    message: "There should be no space {{location}} '{{tokenValue}}'.",
    data: {
      location,
      tokenValue: token.value,
    },
  })
}

module.exports = {
  reportRequired,
  reportMissing,
}
