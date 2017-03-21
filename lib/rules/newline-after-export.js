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
      message: 'Expected newline after export statement.',
      fix( fixer ) {
        const newlines = node.loc.start.line === tokenToInspect.loc.end.line ? '\n\n' : '\n'

        return fixer.insertTextAfter(node, newlines)
      },
    })
  }
}

module.exports = {
  meta: {
    fixable: 'whitespace',
  },
  create( context ) {
    return {
      ExportDefaultDeclaration: ensureCorrectExport(context),
      ExportNamedDeclaration: ensureCorrectExport(context),
    }
  },
}
