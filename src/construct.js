/**
 * VNode constructors are *lazy*: the temporary VNode holds a reference to a function instead of a concrete structure. The actual tree will be created when its parent VNode calls this function. There are several ways to achieve this:
 * * By ensuring that the tree has a document root (see `ensureDoc`)
 * * By wrapping the tree in a document constructor or document-fragment constructor (see `d` or `t`)
 * * By traversing the tree (see `traverse`)
 * At this point the construction *context* can be also bound (JSON, DOM or persistent). After that, all functions will be called recursively to create the actual document with the chosen context.
 * @module construct
 */

import { _n, _a, _v } from "./construct-impl-strict";

/**
 * Creates an element node, which can contain multiple nodes of any type, except `document`.
 * @param  {String|QName} name     The name of the element
 * @param  {VNode} children        The children of the element
 * @return {VNode}                A faux VNode
 */
export function e(name, ...children) {
	return _n(1, name, children);
}

/**
 * Creates an attribute node under an element, or a pair under a map.
 * Can contain a single node of any other type, except `attribute`.
 * Note that when serializing to XML, attribute values are converted to a string following serializer parameters.
 * @param  {String|QName} name     The name of the attribute or pair
 * @param  {VNode} children        The value of the attribute
 * @return {VNode}                A faux VNode
 */
export function a(name, value) {
	return _a(name, value);
}

/**
 * Creates a primitive value node, which can contain a javascript primitive (string, number, boolean or null).
 * @param  {String|Number|Boolean|Null} value The value of the node
  * @return {VNode}                A faux VNode
 */
export function x(value) {
	return _v(3, value);
}

/**
 * Creates a "reference" (or link) node, which can contain a (partial) URI-formatted string.
 * @param  {String} value The value of the node
  * @return {VNode}                A faux VNode
 */
export function r(value) {
	return _v(4, value);
}

/**
 * Creates a list (AKA array) node, which can contain multiple nodes of any type, except `document` and `attribute`.
 * @param  {VNode} children The children of the list
 * @return {VNode}          A faux VNode
 */
export function l(...children) {
	return _n(5, null, children);
}

/**
 * Creates a map (AKA plain object) node, which can contain multiple nodes of type `attribute`.
 * @param  {VNode} children The children of the map
 * @return {VNode}          A faux VNode
 */
export function m(...children) {
	return _n(6, null, children);
}

/**
 * Creates a processing instruction node.
 * @param  {String} target  The target part of the PI
 * @param  {String} content The content part of the PI
 * @return {VNode}         A faux VNode
 */
export function p(target, content) {
	return _v(7, target + " " + content);
}

/**
 * Creates a comment node, which can contain a string.
 * @param  {String} value  The value of the node
 * @return {VNode}         A faux VNode
 */
export function c(value) {
	return _v(8, value);
}

/**
 * Creates a "function call" node, which can contain nodes of any other type.
 * @param  {String|QName} name   The name of the function
 * @param  {VNode} name   The arguments to the function
 * @return {VNode}         A faux VNode
 */
export function f(name,...args) {
	return _n(14, name, args);
}

/**
 * Creates a "quotation" (AKA lambda) node, which can contain nodes of any other type.
 * @param  {VNode} name   The body of the function
 * @return {VNode}         A faux VNode
 */
export function q(...args) {
	return _n(15, null, args);
}
