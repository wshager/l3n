/**
 * L3 node type constant tests
 * @module type
 */

/**
 * Check if type is of leaf class
 * @param  {Number}  type the type constant to test
 * @return {Boolean}      result
 */
export const isLeaf = function isLeaf(type) {
	return type == 2 || type == 3 || type == 4 || type == 7 || type == 8 || type == 10 || type == 12 || type == 16;
};

/**
 * Check if type is of branch class
 * @param  {Number}  type the type constant to test
 * @return {Boolean}      result
 */
export const isBranch = function isBranch(type) {
	return type == 1 || type == 5 || type == 6 || type == 9 || type == 11 || type == 14 || type == 15;
};

/**
 * Check if type is of close class
 * @param  {Number}  type the type constant to test
 * @return {Boolean}      result
 */
export const isClose = type => type == 17;

export const hasName = type => type == 1 || type == 2 || type == 9 || type == 11 || type == 14;

export const hasChildren = type => type == 1 || type == 9 || type == 11;

export const hasArgs = type => type == 14 || type == 15;
