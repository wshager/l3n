"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.e = e;
exports.a = a;
exports.x = x;
exports.r = r;
exports.l = l;
exports.m = m;
exports.p = p;
exports.c = c;
exports.f = f;
exports.q = q;

var _constructImplStrict = require("./construct-impl-strict");

var _util = require("./util");

/**
 * VNode constructors are *lazy*: the temporary VNode holds a reference to a function instead of a concrete structure. The actual tree will be created when its parent VNode calls this function. There are several ways to achieve this:
 * * By ensuring that the tree has a document root (see `ensureDoc`)
 * * By wrapping the tree in a document constructor or document-fragment constructor (see `d` or `t` in [doc](./doc.md))
 * * By traversing the tree (see [traverse](./traverse.md))
 * At this point a 'document implementation context' can be also bound (JSON, DOM or persistent). After that, all functions will be called recursively to create the actual document with the chosen context (see [inode](./inode.md), [pnode](./pnode.md), [dom](./dom.md)).
 * Alternatively a structure can be created by calling the faux VNode's `node` method with a context directly.
 * @module construct
 */

/**
 * Creates an element node, which can contain multiple nodes of any type, except `document`.
 * @param  {String|QName} name     The name of the element
 * @param  {VNode} children        The children of the element
 * @return {VNode}                A faux VNode
 */
function e(name, ...children) {
  return (0, _constructImplStrict._n)(1, name, children);
}
/**
 * Creates an attribute node under an element, or a pair under a map.
 * Can contain a single node of any other type, except `attribute`.
 * Note that when serializing to XML, attribute values are converted to a string following serializer parameters.
 * @param  {String|QName} name     The name of the attribute or pair
 * @param  {VNode} children        The value of the attribute
 * @return {VNode}                A faux VNode
 */


function a(name, value) {
  return (0, _constructImplStrict._a)(name, value);
}
/**
 * Creates a primitive value node, which can contain a javascript primitive (string, number, boolean or null).
 * @param  {String|Number|Boolean|Null} value The value of the node
  * @return {VNode}                A faux VNode
 */


function x(value) {
  return (0, _constructImplStrict._v)((0, _util.isString)(value) ? 3 : 12, value);
}
/**
 * Creates a "reference" (or link) node, which can contain a (partial) URI-formatted string.
 * @param  {String} value The value of the node
  * @return {VNode}                A faux VNode
 */


function r(value) {
  return (0, _constructImplStrict._v)(4, value);
}
/**
 * Creates a list (AKA array) node, which can contain multiple nodes of any type, except `document` and `attribute`.
 * @param  {VNode} children The children of the list
 * @return {VNode}          A faux VNode
 */


function l(...children) {
  return (0, _constructImplStrict._n)(5, null, children);
}
/**
 * Creates a map (AKA plain object) node, which can contain multiple nodes of type `attribute`.
 * @param  {VNode} children The children of the map
 * @return {VNode}          A faux VNode
 */


function m(...children) {
  return (0, _constructImplStrict._n)(6, null, children);
}
/**
 * Creates a processing instruction node.
 * @param  {String} target  The target part of the PI
 * @param  {String} content The content part of the PI
 * @return {VNode}         A faux VNode
 */


function p(target, content) {
  return (0, _constructImplStrict._v)(7, target + " " + content);
}
/**
 * Creates a comment node, which can contain a string.
 * @param  {String} value  The value of the node
 * @return {VNode}         A faux VNode
 */


function c(value) {
  return (0, _constructImplStrict._v)(8, value);
}
/**
 * Creates a "function call" node, which can contain nodes of any other type.
 * @param  {String|QName} name   The name of the function
 * @param  {VNode} name   The arguments to the function
 * @return {VNode}         A faux VNode
 */


function f(name, ...args) {
  return (0, _constructImplStrict._n)(14, name, args);
}
/**
 * Creates a "quotation" (AKA lambda) node, which can contain nodes of any other type.
 * @param  {VNode} name   The body of the function
 * @return {VNode}         A faux VNode
 */


function q(...args) {
  return (0, _constructImplStrict._n)(15, null, args);
}
//# sourceMappingURL=construct.js.map