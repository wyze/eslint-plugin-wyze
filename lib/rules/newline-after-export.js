/**
 * @fileoverview Rule to check for new line after export statement
 * @author Neil Kistner
 * @copyright 2016 Neil Kistner. All rights reserved.
 * See license file in root directory for full license.
 */

'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function getLineDifference( node, nextToken ) {
  return nextToken.loc.start.line - node.loc.start.line;
}

function ensureNoForbiddenKeyword( context, node, tokenToInspect, tokenValue ) {
  if ( !tokenToInspect ) {
    return;
  }

  if (
    getLineDifference(node, tokenToInspect) === 1 &&
    tokenToInspect.type === 'Keyword' &&
    tokenToInspect.value !== tokenValue
  ) {
    context.report({
      loc: tokenToInspect.loc.start,
      message: 'Expected empty line after ' + tokenValue +
        ' statement not followed by another ' + tokenValue + '.',
    });
  }
}

function ensureCorrectExport( context ) {
  return function( node ) {
    const nextToken = context.getSourceCode(node).getTokenAfter(node);

    ensureNoForbiddenKeyword(context, node, nextToken, 'export');
  };
}

module.exports = function( context ) {
  return {
    ExportDefaultDeclaration: ensureCorrectExport(context),
    ExportNamedDeclaration: ensureCorrectExport(context),
  }
}
