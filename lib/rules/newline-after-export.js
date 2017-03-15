'use strict'

const getLineDifference = ( node, nextToken ) =>
  nextToken.loc.start.line - node.loc.start.line

const ensureCorrectExport = context => node => {
  const tokenToInspect = context.getSourceCode(node).getTokenAfter(node)
  const tokenValue = 'export'

  if ( !tokenToInspect ) {
    return
  }

  if (
    getLineDifference(node, tokenToInspect) === 1 &&
    tokenToInspect.type === 'Keyword' &&
    tokenToInspect.value !== tokenValue
  ) {
    context.report({
      loc: tokenToInspect.loc.start,
      message: 'Expected empty line after {{tokenValue}} ' +
        'statement not followed by another {{tokenValue}}.',
      data: {
        tokenValue,
      },
    })
  }
}

module.exports = {
  meta: {},
  create( context ) {
    return {
      ExportDefaultDeclaration: ensureCorrectExport(context),
      ExportNamedDeclaration: ensureCorrectExport(context),
    }
  },
}
