'use strict'

/**
 * List all identifiers' name for given node
 *
 * @param {ASTNode} node - The property node.
 * @returns {Array<String>} identifiers - List of identifiers
 */
const getIdentifiers = node => {
  switch ( node && node.type ) {
    case 'ArrowFunctionExpression':
    case 'FunctionExpression':
      return node.params
        .filter(param => param.type === 'AssignmentPattern')
        .reduce(( identifiers, param ) => [
          ...identifiers,
          ...getIdentifiers(param.right),
        ], [])
    case 'BinaryExpression':
      return [ ...getIdentifiers(node.left), ...getIdentifiers(node.right) ]
    case 'BlockStatement':
      return node.body.map(getIdentifiers)
    case 'CallExpression':
      return [
        ...getIdentifiers(node.callee),
        ...(node.callee && node.callee.body ? getIdentifiers(node.callee.body) : []),
        ...(node.arguments || []).map(getIdentifiers),
      ]
    case 'ConditionalExpression':
      return [
        ...getIdentifiers(node.test),
        ...getIdentifiers(node.consequent),
        ...getIdentifiers(node.alternate),
      ]
    case 'LogicalExpression':
      return [ ...getIdentifiers(node.left), ...getIdentifiers(node.right) ]
    case 'Identifier':
      return [ node.name ]
    case 'MemberExpression':
      return [
        ...getIdentifiers(node.object),
        ...getIdentifiers(node.property),
      ]

    default:
      return []
  }
}

module.exports = getIdentifiers
