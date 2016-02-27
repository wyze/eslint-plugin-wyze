/**
 * @fileoverview Rule to require spacing in control statements
 * @author Neil Kistner
 * @copyright 2016 Neil Kistner. All rights reserved.
 * See license file in root directory for full license.
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function( context ) {
  var getTokenByRangeStart =
    context.eslint.getTokenByRangeStart.bind(context.eslint);

  /**
   * Gets the token for the opening parenthesis.
   *
   * @param {Token} token - the Statement (If/For/etc.) token.
   * @returns {Token} location of the `Punctuator` token for `(`
   */
  function findParen( token ) {
    var possible = getTokenByRangeStart(token.end);

    if ( !possible ) {
      return getTokenByRangeStart(token.end + 1);
    }

    return possible;
  }

  /**
   * Determines if a space is adjacent to a `(` or `)`.
   *
   * @param {Token} token - the Punctuator token
   * @returns {Bool} true if no space adjacent
   */
  function noSpaceAdjacentParen( token ) {
    return getTokenByRangeStart(token.end) !== null;
  }

  /**
   * Performs logic on the node to determine if it is valid.
   *
   * @param {ASTNode} node - the Statement (If/For/etc.) node
   */
  function assertStatement( node ) {
    var token = getTokenByRangeStart(node.start);

    if ( noSpaceAdjacentParen(findParen(token)) ) {
      context.report({
        node: node,
        message: 'There must be a space after this paren.'
      });
    }

    if ( noSpaceAdjacentParen(node.update || node.test) ) {
      context.report({
        node: node,
        message: 'There must be a space before this paren.'
      });
    }
  }

  return {
    IfStatement: assertStatement,
    ForStatement: assertStatement,
  };
};

module.exports.schema = [];
