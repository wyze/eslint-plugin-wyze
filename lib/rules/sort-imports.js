/* eslint-disable wyze/max-file-length */

'use strict'

const enums = [ 'none', 'type', 'all', 'named', 'default' ]
const lower = s => s && s.toLowerCase()

/**
 * Gets the used member syntax style.
 *
 * import 'my-module.js' --> none
 * import * as myModule from 'my-module.js' --> all
 * import {myMember} from 'my-module.js' --> named
 * import {foo, bar} from 'my-module.js' --> named
 * import baz from 'my-module.js' --> default
 * import type { Foo } from 'my-module.js' --> type
 *
 * @param {ASTNode} node - the ImportDeclaration node.
 * @returns {string} used member parameter style
 */
const usedMemberSyntax = node => {
  const specifiers = node.specifiers

  if ( !specifiers.length ) {
    return 'none'
  } else if ( node.importKind === 'type' ) {
    return 'type'
  } else if ( specifiers[0].type === 'ImportNamespaceSpecifier' ) {
    return 'all'
  } else if ( specifiers[0].type === 'ImportDefaultSpecifier' ) {
    return 'default'
  }

  return 'named'
}

/**
 * Gets the local name of the first imported module.
 * @param {ASTNode} node - the ImportDeclaration node.
 * @returns {?string} the local name of the first imported module.
 */
const getFirstLocalMemberName = node =>
  node.specifiers[0] ? node.specifiers[0].local.name : null

const getRootNode = node => {
  let testNode = node

  while ( testNode ) {
    if ( testNode.type === 'Program' ) {
      return testNode
    }
    testNode = testNode.parent
  }

  throw new Error('Could not get Program node')
}

const getContentBetweenSpecifiers = ( context, parent, nodeOrTokenA, nodeOrTokenB ) => {
  const sourceCode = context.getSourceCode()
  const text = sourceCode.getText(parent)

  const start = nodeOrTokenA.end - parent.start
  const length = nodeOrTokenB.start - nodeOrTokenA.end
  const contentBetween = text.substr(start, length)

  return contentBetween
}


const getContentBetweenDeclarations = ( context, nodeOrTokenA, nodeOrTokenB ) => {
  const sourceCode = context.getSourceCode()
  const rootNode = getRootNode(nodeOrTokenA)

  const text = sourceCode.getText(rootNode)

  const start = nodeOrTokenA.end - nodeOrTokenA.start
  const length = nodeOrTokenB.start - nodeOrTokenA.end
  const contentBetween = text.substr(start, length)

  return contentBetween
}

const checkSpecifiers = ( context, getText, node, ignoreMemberSort, ignoreCase ) => {
  if ( !ignoreMemberSort && node.specifiers.length > 1 ) {
    let pSpecifier
    let pSpecifierName
    const makeFix = cSpecifier => fixer => {
      const delimiter = getContentBetweenSpecifiers(
        context,
        node,
        pSpecifier.local,
        cSpecifier.local
      )

      return fixer.replaceTextRange(
        [
          pSpecifier.range[0],
          cSpecifier.range[1],
        ],
        `${getText(cSpecifier)}${delimiter}${getText(pSpecifier)}`
      )
    }

    // eslint-disable-next-line no-plusplus
    for ( let i = 0; i < node.specifiers.length; ++i ) {
      const cSpecifier = node.specifiers[i]

      if ( cSpecifier.type !== 'ImportSpecifier' ) {
        continue // eslint-disable-line no-continue
      }

      let cSpecifierName = cSpecifier.local.name

      if ( ignoreCase ) {
        cSpecifierName = lower(cSpecifierName)
      }

      if ( pSpecifier && cSpecifierName < pSpecifierName ) {
        context.report({
          node: cSpecifier,
          message: "Member '{{memberName}}' of the import declaration should be sorted alphabetically.",
          data: {
            memberName: cSpecifier.local.name,
          },
          fix: makeFix(cSpecifier),
        })
      }

      pSpecifier = cSpecifier
      pSpecifierName = cSpecifierName
    }
  }
}

module.exports = {
  meta: {
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          ignoreCase: {
            type: 'boolean',
          },
          memberSyntaxSortOrder: {
            type: 'array',
            items: {
              enum: enums,
            },
            uniqueItems: true,
            minItems: 5,
            maxItems: 5,
          },
          ignoreMemberSort: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create( context ) {
    const sc = context.getSourceCode()
    const config = context.options[0] || {}
    const ignoreCase = config.ignoreCase || false
    const ignoreMemberSort = config.ignoreMemberSort || false
    const memberSyntaxSortOrder = config.memberSyntaxSortOrder || enums

    let pNode

    /**
     * Gets the group by member parameter index for given declaration.
     * @param {ASTNode} node - the ImportDeclaration node.
     * @returns {number} the declaration group by member index.
     */
    const getMemberParameterGroupIndex = node =>
      memberSyntaxSortOrder.indexOf(usedMemberSyntax(node))

    /**
     * Get source code for given node
     * @param {ASTNode} node - The node to getText on.
     * @returns {string} the source code for the node.
     */
    const getText = node => sc.getText(node)

    return {
      ImportDeclaration( node ) {
        if ( pNode ) {
          const cMemberSyntaxGroupIndex = getMemberParameterGroupIndex(node)
          const pMemberSyntaxGroupIndex = getMemberParameterGroupIndex(pNode)

          let cLocalMemberName = getFirstLocalMemberName(node)
          let pLocalMemberName = getFirstLocalMemberName(pNode)

          if ( ignoreCase ) {
            pLocalMemberName = lower(pLocalMemberName)
            cLocalMemberName = lower(cLocalMemberName)
          }

          const fix = fixer => {
            const delimiter = getContentBetweenDeclarations(context, pNode, node)


            return fixer.replaceTextRange(
              [
                pNode.range[0],
                node.range[1],
              ],
              `${getText(node)}${delimiter}${getText(pNode)}`
            )
          }

          // When the current declaration uses a different member syntax,
          // then check if the ordering is correct.
          // Otherwise, make a default string compare (like rule sort-vars
          // to be consistent) of the first used local member name.
          if ( cMemberSyntaxGroupIndex !== pMemberSyntaxGroupIndex ) {
            if ( cMemberSyntaxGroupIndex < pMemberSyntaxGroupIndex ) {
              context.report({
                node,
                message: "Expected '{{syntaxA}}' syntax before '{{syntaxB}}' syntax.",
                data: {
                  syntaxA: memberSyntaxSortOrder[cMemberSyntaxGroupIndex],
                  syntaxB: memberSyntaxSortOrder[pMemberSyntaxGroupIndex],
                },
                fix,
              })
            }
          } else if (
            pLocalMemberName &&
            cLocalMemberName &&
            cLocalMemberName < pLocalMemberName
          ) {
            context.report({
              node,
              message: 'Imports should be sorted alphabetically.',
              fix,
            })
          }
        }

        // Multiple members of an import declaration should also be
        // sorted alphabetically.
        checkSpecifiers(context, getText, node, ignoreMemberSort, ignoreCase)

        pNode = node
      },
    }
  },
}
