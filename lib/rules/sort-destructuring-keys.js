/* eslint-disable wyze/max-file-length */

'use strict'

const getIdentifiers = require('./helpers/getSortDependencies')

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

const isComputedProperty = property => property !== undefined && property.computed === true

/**
 * Get correct name for object key.
 *
 * @param {ASTNode} node - The property node.
 * @returns {string} Object key name.
 */
const getKeyName = node =>
  node.type === 'ExperimentalRestProperty' ? node.argument.name : node.key.name

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

const createFixer = ( sourceCode, properties, sortFn ) => fixer => fixer
  .replaceTextRange(
    [ properties[0].range[0], properties[properties.length - 1].range[1] ],
    sortFn(properties)
      .reduce(( sourceText, property, index ) => {
        const textAfterIdentifier = index === properties.length - 1
          ? ''
          : sourceCode.getText().slice(properties[index].range[1], properties[index + 1].range[0])

        return sourceText + sourceCode.getText(property) + textAfterIdentifier
      }, '')
  )

/**
 * Sorts properties using getOrder function
 *
 * @param {string} order - Either `asc` or `desc`.
 * @param {string} modifier - Either `I` or undefined.
 * @param {boolean} ignoreComputed - whether to ignore computed properties
 * @returns {Function} The sort function
 */
const getValidOrder = ( order, modifier, ignoreComputed ) => {
  const isValidOrder = (() => {
    const sort = getOrder(order, modifier)

    return ( a, b ) => sort(getKeyName(a), getKeyName(b)) ? -1 : 1
  })()

  return properties => {
    if ( ignoreComputed ) return [ ...properties ].sort(isValidOrder)

    return [
      ...properties
        .filter(isComputedProperty)
        .sort(isValidOrder),
      ...properties
        .filter(property => !isComputedProperty(property))
        .sort(isValidOrder),
    ]
  }
}


module.exports = {
  meta: {
    fixable: 'code',
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
          ignoreDefaults: {
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
    const sourceCode = context.getSourceCode()
    const insensitive = options.caseSensitive === false
    const ignoreComputed = options.ignoreComputed === true
    const includeDefaults = options.ignoreDefaults === false
    const isValidOrder = getOrder(order, insensitive ? 'I' : '')
    const sortProperties = getValidOrder(order, insensitive ? 'I' : '', ignoreComputed)

    return {
      ObjectPattern( node ) {
        const { properties } = node
        const filteredProperties = properties
          .filter(prop => !prop.computed && prop.type !== 'ExperimentalRestProperty')
        const allKeys = filteredProperties.map(getKeyName)
        const keys = !includeDefaults
          ? allKeys
          : filteredProperties
            .map(( prop, i ) => [
              allKeys[i],
              getKeyValue(prop)
                .filter(key => allKeys.includes(key)),
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
          const computed = properties.map(isComputedProperty)
          const start = computed.indexOf(false)
          const end = computed.lastIndexOf(true)

          if ( start > -1 && start < end ) {
            context.report({
              node,
              message: 'Computed properties must be placed before all other properties.',
              fix: createFixer(sourceCode, properties, sortProperties),
            })

            return
          }
        }

        if ( keys.length === 0 ) {
          return
        }

        keys.reduce(( cur, next ) => {
          let key = cur
          let nextKey = next
          let dependencies = []

          if ( includeDefaults ) {
            [ key ] = cur;
            [ nextKey, dependencies ] = next
          }

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
              fix: createFixer(sourceCode, properties, sortProperties),
            })
          }

          return next
        })
      },
    }
  },
}
