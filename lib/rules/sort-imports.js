'use strict'

const enums = [ 'none', 'all', 'named', 'default' ]
const lower = s => s && s.toLowerCase()

/**
 * Gets the used member syntax style.
 *
 * import 'my-module.js' --> none
 * import * as myModule from 'my-module.js' --> all
 * import {myMember} from 'my-module.js' --> named
 * import {foo, bar} from  'my-module.js' --> named
 * import baz from 'my-module.js' --> default
 *
 * @param {ASTNode} node - the ImportDeclaration node.
 * @returns {string} used member parameter style
 */
const usedMemberSyntax = node => {
  const specifiers = node.specifiers

  if ( !specifiers.length ) {
    return 'none'
  } else if ( specifiers[0].type === 'ImportNamespaceSpecifier' ) {
    return 'all'
  } else if ( specifiers[0].type === 'ImportDefaultSpecifier' ) {
    return 'default'
  } else {
    return 'named'
  }
}

/**
 * Gets the local name of the first imported module.
 * @param {ASTNode} node - the ImportDeclaration node.
 * @returns {?string} the local name of the first imported module.
 */
const getFirstLocalMemberName = node =>
  node.specifiers[0] ? node.specifiers[0].local.name : null

module.exports = {
  meta: {
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
            minItems: 4,
            maxItems: 4,
          },
          ignoreMemberSort: {
            type: 'boolean',
          },
        },
        additionalProperties: false
      },
    ],
  },
  create( context ) {
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

          // When the current declaration uses a different member syntax,
          // then check if the ordering is correct.
          // Otherwise, make a default string compare (like rule sort-vars
          // to be consistent) of the first used local member name.
          if ( cMemberSyntaxGroupIndex !== pMemberSyntaxGroupIndex ) {
            if ( cMemberSyntaxGroupIndex < pMemberSyntaxGroupIndex ) {
              context.report({
                node,
                message: 'Expected \'{{syntaxA}}\' syntax before ' +
                  '\'{{syntaxB}}\' syntax.',
                data: {
                  syntaxA: memberSyntaxSortOrder[cMemberSyntaxGroupIndex],
                  syntaxB: memberSyntaxSortOrder[pMemberSyntaxGroupIndex],
                },
              })
            }
          } else {
            if (
              pLocalMemberName &&
              cLocalMemberName &&
              cLocalMemberName < pLocalMemberName
            ) {
              context.report({
                node,
                message: 'Imports should be sorted alphabetically.',
              })
            }
          }
        }

        // Multiple members of an import declaration should also be
        // sorted alphabetically.
        if ( !ignoreMemberSort && node.specifiers.length > 1 ) {
          let pSpecifier
          let pSpecifierName

          for ( let i = 0; i < node.specifiers.length; ++i ) {
            const cSpecifier = node.specifiers[i]

            if ( cSpecifier.type !== 'ImportSpecifier' ) {
              continue
            }

            let cSpecifierName = cSpecifier.local.name

            if ( ignoreCase ) {
              cSpecifierName = lower(cSpecifierName)
            }

            if ( pSpecifier && cSpecifierName < pSpecifierName ) {
              context.report({
                node: cSpecifier,
                message: 'Member \'{{memberName}}\' of the import declaration' +
                  ' should be sorted alphabetically.',
                data: {
                  memberName: cSpecifier.local.name
                }
              })
            }

            pSpecifier = cSpecifier;
            pSpecifierName = cSpecifierName;
          }
        }

        pNode = node
      },
    }
  },
}
