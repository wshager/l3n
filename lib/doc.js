"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ensureDoc = ensureDoc;
exports.d = d;
exports.t = t;
exports.doctype = doctype;

var _operators = require("rxjs/operators");

var _vnode = require("./vnode");

var _constructImplStrict = require("./construct-impl-strict");

var _just = require("./just");

var _just2 = _interopRequireDefault(_just);

var _inode = require("./inode");

var inode = _interopRequireWildcard(_inode);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Wraps a document into a document-fragment if it doesn't have a document root
 * @param  {any} $node  Observable, VNode or any kind of node mathing the provided document implementation context
 * @return {Observable} Observable yielding a single VNode
 */
function ensureDoc($node) {
	// FIXME if isVNode(node) use cx on node
	var cx = (0, _vnode.getContext)(this, inode);
	return (0, _just2.default)($node).pipe((0, _operators.concatMap)(function (node) {
		if (!(0, _vnode.isVNode)(node)) {
			var type = cx.getType(node);
			if (type == 9 || type == 11) {
				var root = cx.first(node);
				return (0, _just2.default)(cx.vnode(root, cx.vnode(node), 1, 0));
			} else {
				// create a document-fragment by default!
				var doc = t.bind(cx)();
				var _root = cx.vnode(node, doc, 1, 0);
				return (0, _just2.default)(doc).pipe((0, _operators.concatMap)(function (doc) {
					doc = doc.push([0, _root.node]);
					var next = doc.first();
					return next ? (0, _just2.default)(doc.vnode(next, doc, doc.depth + 1, 0)) : (0, _just2.default)();
				}));
			}
		}
		if (typeof node.node === "function") {
			// NOTE never bind to current node.cx, but purposely allow cross-binding
			return (0, _just2.default)(t.bind(cx)(node)).pipe((0, _operators.concatMap)(function (node) {
				var next = node.first();
				return next ? (0, _just2.default)(node.vnode(next, node, node.depth + 1, 0)) : (0, _just2.default)();
			}));
		}
		return (0, _just2.default)(node);
	}));
}

/**
 * Creates a document node, which can contain a nodes of any other type.
 * This is a top level node, and may not be contained in other nodes.
 * @param  {VNode} children The children of the document
 * @return {VNode}          A VNode containing a document
 */
/**
 * Document-related functions
 * @module doc
 */

function d(...children) {
	return (0, _constructImplStrict._n)(9, "#document", children).node((0, _vnode.getContext)(this, inode));
}

/**
 * Creates a document-fragment node, which can contain nodes of any other type.
 * This is a top level node, and may not be contained in other nodes.
 * @param  {VNode} children The children of the document-fragment
 * @return {VNode}          A VNode containing a document-fragment
 */
function t(...children) {
	return (0, _constructImplStrict._n)(11, "#document-fragment", children).node((0, _vnode.getContext)(this, inode));
}

/**
 * Creates a document type node.
 * @param  {String} name          The qualified name
 * @param  {String} publicId=""   The PUBLIC identifier
 * @param  {String} systemId=""   The SYSTEM identifier
 * @return {VNode}               A faux VNode
 */
function doctype(name, publicId = "", systemId = "") {
	return (0, _constructImplStrict._v)(10, [name, publicId, systemId]);
}
//# sourceMappingURL=doc.js.map