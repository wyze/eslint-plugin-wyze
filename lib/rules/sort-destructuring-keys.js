/**
 * @fileoverview Rule to ensure sorting of destructuring keys
 * @author Neil Kistner
 * @copyright 2017 Neil Kistner. All rights reserved.
 * See license file in root directory for full license.
 */

'use strict';

// Taken from: https://github.com/eslint/eslint/blob/master/lib/rules/sort-keys.js#L43
/**
 * Functions which check that the given 2 names are in specific order.
 *
 * Postfix `I` is meant insensitive.
 *
 * @private
 */

function compare( a, b ) {
  return a <= b;
}

function lower( s ) {
  return s.toLowerCase();
}

const isValidOrders = {
  asc( a, b ) {
    return a <= b;
  },
  ascI(a, b) {
    return a.toLowerCase() <= b.toLowerCase();
  },
}

function getOrder( order, modifier ) {
  switch ( order + modifier ) {
    case 'asc':
      return compare
    case 'ascI':
      return function compareI( a, b ) {
        return compare(lower(a), lower(b));
      }
    case 'desc':
      return function desc( a, b ) {
        return compare(b, a);
      }
    case 'descI':
      return function descI( a, b ) {
        return compare(lower(b), lower(a));
      }
  }
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function( context ) {
  var order = context.options[0] || 'asc';
  var options = context.options[1] || {};
  var insensitive = options.caseSensitive === false;
  var ignoreComputed = options.ignoreComputed === true;
  var isValidOrder = getOrder(order, insensitive ? 'I': '')

  return {
    ObjectPattern: function( node ) {
      var properties = node.properties;
      var keys = properties
        .filter(function( prop ) {
          return !prop.computed;
        })
        .map(function( prop ) {
          return prop.key.name;
        });

      if ( !ignoreComputed ) {
        var computed = properties
          .map(function( prop ) { return prop.computed; });
        var start = computed.indexOf(false)
        var end = computed.lastIndexOf(true)

        if ( start > -1 && start < end ) {
          context.report({
            node: node,
            message: 'Computed properties must be placed before all other properties.',
          })

          return;
        }
      }

      keys.sort(function( key, nextKey ) {
        if ( !isValidOrder(key, nextKey) ) {
          context.report({
            node: node,
            message: 'Destructuring keys should be sorted in {{insensitive}}{{order}}ending order. ' +
              '\'{{thisName}}\' should be before \'{{prevName}}\'.',
            data: {
              thisName: nextKey.trim(),
              prevName: key.trim(),
              insensitive: insensitive ? 'insensitive ' : '',
              order: order,
            },
          });
        }
      });
    },
  };
};

module.exports.schema = [
  {
    enum: [ 'asc', 'desc' ],
  },
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
];
