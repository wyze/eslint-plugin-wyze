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
   * Determines if a space is after a `(`.
   *
   * @param {Token} token - the Punctuator token.
   * @returns {Bool} true if no space after
   */
  function noSpaceAfterParen( token ) {
    return getTokenByRangeStart(token.end) !== null;
  }

  /**
   * Determines if a space is before a `)`.
   *
   * @param {Token} token - the Punctuator token.
   * @returns {Bool} true if no space before
   */
  function noSpaceBeforeParen( token ) {
    return getTokenByRangeStart(token.end) !== null;
  }


  return {
    IfStatement: function( node ) {
      var token = getTokenByRangeStart(node.start);

      if ( noSpaceAfterParen(findParen(token)) ) {
        context.report({
          node: node,
          message: 'There must be a space after this paren.'
        });
      }

      if ( noSpaceBeforeParen(node.test) ) {
        context.report({
          node: node,
          message: 'There must be a space before this paren.'
        });
      }
    }
  };
};

module.exports.schema = [];
