/**
 * @fileoverview Rule to check the file length
 * @author Neil Kistner
 * @copyright 2016 Neil Kistner. All rights reserved.
 * See license file in root directory for full license.
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function( context ) {
  return {
    Program: function( node ) {
      var lines = context.getSourceLines().length;
      var max = context.options[0] || 200;

      if ( lines > max ) {
        context.report({
          node: node,
          message: 'Max lines is set to ' + max + '. File contains ' + lines + ' lines.'
        });
      }
    }
  }
};

module.exports.schema = [
  {
    type: 'number'
  }
];
