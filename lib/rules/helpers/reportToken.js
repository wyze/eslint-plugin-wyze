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
    fix( fixer ) {
      return location === 'after'
        ? fixer.insertTextAfter(token, ' ')
        : fixer.insertTextBefore(token, ' ')
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
    fix( fixer ) {
      return location === 'after'
        ? fixer.removeRange([ token.range[1], token.range[1] + 1 ])
        : fixer.removeRange([ token.range[0] - 1, token.range[0] ])
    },
  })
}

module.exports = {
  reportRequired,
  reportMissing,
}
