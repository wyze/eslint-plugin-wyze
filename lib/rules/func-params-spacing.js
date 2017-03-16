'use strict'

/**
 * ( a, b ) => {} --> space
 * ({ a, b }) => {} --> no space
 * ([ a, b ]) => {} --> no space
 * ( { a }, b ) => {} --> space
 * ({ a }, { b }) => {} --> no space
 * ([ a ], b, [ c ]) => {} --> no space
 * ([ a ], b, { c }) => {} --> no space
 * ( a: string ) => {} --> space
 * ( { a }: Props ) => {} --> space
 * ({ a }: { a: string }) => {} --> no space
 */

module.exports = {
  meta: {},
  create( context ) {
    const sc = context.getSourceCode()

    /**
     * Reports that the node is not valid.
     *
     * @param {ASTNode} node - the Statement (If/For/etc.) node
     * @param {String} location - 'before' / 'after'
     * @param {Token} token - token of the paren
     */
    const reportRequired = ( node, location, token ) => {
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
    const reportMissing = ( node, location, token ) => {
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

    /**
     * Maybe report about a required space.
     *
     * @param {ASTNode} node - the Statement (If/For/etc.) node
     * @param {String} location - before/after where space is
     * @param {Token} start - the beginning token
     * @param {Token} end - the ending token
     */
    const maybeReportRequiredSpace = ( node, location, start, end ) => {
      if ( !sc.isSpaceBetweenTokens(start, end) ) {
        reportRequired(node, location, location === 'after' ? start : end)
      }
    }

    /**
     * Maybe report about a missing space.
     *
     * @param {ASTNode} node - the Statement (If/For/etc.) node
     * @param {String} location - before/after where space is
     * @param {Token} start - the beginning token
     * @param {Token} end - the ending token
     */
    const maybeReportMissingSpace = ( node, location, start, end ) => {
      if ( sc.isSpaceBetweenTokens(start, end) ) {
        reportMissing(node, location, location === 'after' ? start : end)
      }
    }

    /**
     * Checks params for destructuring in the first and last param.
     *
     * @param {Token} first - the first token
     * @param {Token} last - the last token
     */
    const isParamDestructuring = ( first, last ) => /^(\[|\]|\{|\}){2}$/.test(`${first}${last}`)

    /**
     * Gets the index location for the first paren.
     *
     * @param {String} type - the type of the node
     */
    const getParenTokenIndex = type => {
      if ( type === 'ArrowFunctionExpression' ) {
        return 0
      }

      if ( type === 'FunctionExpression' ) {
        return 1
      }

      return 2
    }

    /**
     * Performs logic on the node to determine if it is valid.
     *
     * @param {ASTNode} node - the Statement (If/For/etc.) node
     */
    const assertStatement = node => {
      if ( !node.params.length ) {
        const tokens = sc.getTokens(node)
        const index = getParenTokenIndex(node.type)
        const firstParen = tokens[index]
        const secondParen = tokens[index + 1]

        maybeReportMissingSpace(node, 'after', firstParen, secondParen)

        return
      }

      const firstParam = node.params.slice(0, 1).pop()
      const lastParam = node.params.slice(-1).pop()
      const before = sc.getTokenBefore(firstParam)
      const first = sc.getFirstToken(firstParam)
      const after = sc.getTokenAfter(lastParam)
      const last = sc.getLastToken(lastParam)

      if ( isParamDestructuring(first.value, last.value) ) {
        maybeReportMissingSpace(node, 'after', before, first)
        maybeReportMissingSpace(node, 'before', last, after)
      } else {
        maybeReportRequiredSpace(node, 'after', before, first)
        maybeReportRequiredSpace(node, 'before', last, after)
      }
    }

    return {
      ArrowFunctionExpression: assertStatement,
      FunctionDeclaration: assertStatement,
      FunctionExpression: assertStatement,
    }
  },
}
