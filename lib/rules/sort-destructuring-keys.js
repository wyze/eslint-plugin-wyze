/* eslint-disable wyze/max-file-length */

'use strict'

/**
 * Compare strings for sort order.
 *
 * @param {string} left - Left word.
 * @param {string} right - Right word.
 * @returns {boolean} Whether the left word comes before the right word.
 */
const compare = ( left, right ) => left <= right

/**
 * Turns a string to lower case.
 *
 * @param {string} word - The word to lowercase.
 * @returns {string} The lowercased word.
 */
const lower = word => word.toLowerCase()

/**
 * Uses the options to figure out the correct sort order.
 *
 * @param {string} order - Either `asc` or `desc`.
 * @param {string} [modifier] - Either `I` or undefined.
 * @returns {Function} The compare function to use.
 */
const getOrder = ( order, modifier ) => {
  switch ( order + modifier ) {
    case 'asc':
      return compare
    case 'ascI':
      return function compareI( a, b ) {
        return compare(lower(a), lower(b))
      }
    case 'desc':
      return function desc( a, b ) {
        return compare(b, a)
      }
    case 'descI':
      return function descI( a, b ) {
        return compare(lower(b), lower(a))
      }
    default:
      return ''
  }
}

/**
 * Get correct name for object key.
 *
 * @param {ASTNode} node - The property node.
 * @returns {string} Object key name.
 */
const getKeyName = node =>
  node.type === 'ExperimentalRestProperty' ? node.argument.name : node.key.name

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

/**
 * Get default value for given for object key.
 *
 * @param {ASTNode} node - The property node.
 * @returns {Array<String>} identifiers - List of identifiers
 */
const getKeyValue = node => {
  if ( node.value.type !== 'AssignmentPattern' ) return []

  return Array.from(new Set(getIdentifiers(node.value.right)))
}

module.exports = {
  meta: {
    schema: [
      { enum: [ 'asc', 'desc' ] },
      {
        type: 'object',
        properties: {
          caseSensitive: {
            type: 'boolean',
          },
          ignoreComputed: {
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create( context ) {
    const order = context.options[0] || 'asc'
    const options = context.options[1] || {}
    const insensitive = options.caseSensitive === false
    const ignoreComputed = options.ignoreComputed === true
    const isValidOrder = getOrder(order, insensitive ? 'I' : '')

    return {
      ObjectPattern( node ) {
        const { properties } = node
        const filteredProperties = properties
          .filter(prop => !prop.computed && prop.type !== 'ExperimentalRestProperty')
        const allKeys = filteredProperties.map(getKeyName)
        const keys = filteredProperties
          .map(( prop, i ) => [
            allKeys[i],
            getKeyValue(prop)
              .filter(Array.prototype.includes, allKeys),
          ])
        const types = properties.map(prop => prop.type)
        const restIndex = types.indexOf('ExperimentalRestProperty')

        if ( restIndex !== -1 && restIndex !== types.length - 1 ) {
          context.report({
            node,
            message: 'Rest properties must be placed after all other properties.',
          })

          return
        }

        if ( !ignoreComputed ) {
          const computed = properties.map(prop => prop.computed)
          const start = computed.indexOf(false)
          const end = computed.lastIndexOf(true)

          if ( start > -1 && start < end ) {
            context.report({
              node,
              message: 'Computed properties must be placed before all other properties.',
            })

            return
          }
        }

        if ( keys.length === 0 ) {
          return
        }

        keys.reduce(( [ key ], next ) => {
          const [ nextKey, dependencies ] = next

          if ( !dependencies.includes(key) && !isValidOrder(key, nextKey) ) {
            context.report({
              node,
              message: 'Destructuring keys should be sorted in ' +
                '{{insensitive}}{{order}}ending order. ' +
                "'{{thisName}}' should be before '{{prevName}}'.",
              data: {
                thisName: nextKey.trim(),
                prevName: key.trim(),
                insensitive: insensitive ? 'insensitive ' : '',
                order,
              },
            })
          }

          return next
        })
      },
    }
  },
}
