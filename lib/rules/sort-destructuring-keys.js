'use strict'

const compare = ( a, b ) => a <= b
const lower = s => s.toLowerCase()
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
        const properties = node.properties
        const keys = properties
          .filter(prop => !prop.computed)
          .map(prop => getKeyName(prop))

        if ( !ignoreComputed ) {
          const computed = properties.map(prop => prop.computed)
          const start = computed.indexOf(false)
          const end = computed.lastIndexOf(true)

          if ( start > -1 && start < end ) {
            context.report({
              node,
              message: 'Computed properties must be placed before all other' +
                ' properties.',
            })

            return
          }
        }

        keys.sort(( key, nextKey ) => {
          if ( !isValidOrder(key, nextKey) ) {
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

          return null
        })
      },
    }
  },
}
