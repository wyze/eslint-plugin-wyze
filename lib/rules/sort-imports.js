/**
 * @fileoverview Rule to require sorting of import declarations
 * @author Neil Kistner
 * @copyright 2016 Neil Kistner. All rights reserved.
 * See license file in root directory for full license.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

    var configuration = context.options[0] || {},
        ignoreCase = configuration.ignoreCase || false,
        ignoreMemberSort = configuration.ignoreMemberSort || false,
        memberSyntaxSortOrder = configuration.memberSyntaxSortOrder || ["none", "all", "named", "default"],
        previousDeclaration = null;

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
     * @returns {string} used member parameter style, ["all", "named", "default"]
     */
    function usedMemberSyntax(node) {
        if (node.specifiers.length === 0) {
            return "none";
        } else if (node.specifiers[0].type === "ImportNamespaceSpecifier") {
            return "all";
        } else if (node.specifiers[0].type === "ImportDefaultSpecifier") {
            return "default";
        } else {
            return "named";
        }
    }

    /**
     * Gets the group by member parameter index for given declaration.
     * @param {ASTNode} node - the ImportDeclaration node.
     * @returns {number} the declaration group by member index.
     */
    function getMemberParameterGroupIndex(node) {
        return memberSyntaxSortOrder.indexOf(usedMemberSyntax(node));
    }

    /**
     * Gets the local name of the first imported module.
     * @param {ASTNode} node - the ImportDeclaration node.
     * @returns {?string} the local name of the first imported module.
     */
    function getFirstLocalMemberName(node) {
        if (node.specifiers[0]) {
            return node.specifiers[0].local.name;
        } else {
            return null;
        }
    }

    return {
        "ImportDeclaration": function(node) {
            if (previousDeclaration) {
                var currentLocalMemberName = getFirstLocalMemberName(node),
                    currentMemberSyntaxGroupIndex = getMemberParameterGroupIndex(node),
                    previousLocalMemberName = getFirstLocalMemberName(previousDeclaration),
                    previousMemberSyntaxGroupIndex = getMemberParameterGroupIndex(previousDeclaration);

                if (ignoreCase) {
                    previousLocalMemberName = previousLocalMemberName && previousLocalMemberName.toLowerCase();
                    currentLocalMemberName = currentLocalMemberName && currentLocalMemberName.toLowerCase();
                }

                // When the current declaration uses a different member syntax,
                // then check if the ordering is correct.
                // Otherwise, make a default string compare (like rule sort-vars to be consistent) of the first used local member name.
                if (currentMemberSyntaxGroupIndex !== previousMemberSyntaxGroupIndex) {
                    if (currentMemberSyntaxGroupIndex < previousMemberSyntaxGroupIndex) {
                        context.report({
                            node: node,
                            message: "Expected '{{syntaxA}}' syntax before '{{syntaxB}}' syntax.",
                            data: {
                                syntaxA: memberSyntaxSortOrder[currentMemberSyntaxGroupIndex],
                                syntaxB: memberSyntaxSortOrder[previousMemberSyntaxGroupIndex]
                            }
                        });
                    }
                } else {
                    if (previousLocalMemberName &&
                        currentLocalMemberName &&
                        currentLocalMemberName < previousLocalMemberName
                    ) {
                        context.report({
                            node: node,
                            message: "Imports should be sorted alphabetically."
                        });
                    }
                }
            }

            // Multiple members of an import declaration should also be sorted alphabetically.
            if (!ignoreMemberSort && node.specifiers.length > 1) {
                var previousSpecifier = null;
                var previousSpecifierName = null;

                for (var i = 0; i < node.specifiers.length; ++i) {
                    var currentSpecifier = node.specifiers[i];
                    if (currentSpecifier.type !== "ImportSpecifier") {
                        continue;
                    }

                    var currentSpecifierName = currentSpecifier.local.name;
                    if (ignoreCase) {
                        currentSpecifierName = currentSpecifierName.toLowerCase();
                    }

                    if (previousSpecifier && currentSpecifierName < previousSpecifierName) {
                        context.report({
                            node: currentSpecifier,
                            message: "Member '{{memberName}}' of the import declaration should be sorted alphabetically.",
                            data: {
                                memberName: currentSpecifier.local.name
                            }
                        });
                    }

                    previousSpecifier = currentSpecifier;
                    previousSpecifierName = currentSpecifierName;
                }
            }

            previousDeclaration = node;
        }
    };
};

module.exports.schema = [
    {
        "type": "object",
        "properties": {
            "ignoreCase": {
                "type": "boolean"
            },
            "memberSyntaxSortOrder": {
                "type": "array",
                "items": {
                    "enum": ["none", "all", "named", "default"]
                },
                "uniqueItems": true,
                "minItems": 4,
                "maxItems": 4
            },
            "ignoreMemberSort": {
                "type": "boolean"
            }
        },
        "additionalProperties": false
    }
];
