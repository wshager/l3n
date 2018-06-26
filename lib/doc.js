"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ensureDoc = ensureDoc;
exports.d = d;
exports.t = t;

var _rxjs = require("rxjs");

var _vnode = require("./vnode");

var _construct = require("./construct");

var _inode = require("./inode");

var inode = _interopRequireWildcard(_inode);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const just = $o => (0, _rxjs.isObservable)($o) ? $o : (0, _rxjs.of)($o);

function ensureDoc($node) {
	// FIXME if isVNode(node) use cx on node
	var cx = this && this.vnode ? this : inode;
	return just($node).concatMap(function (node) {
		if (!node.inode) {
			var type = cx.getType(node);
			if (type == 9 || type == 11) {
				var root = cx.first(node);
				return just(cx.vnode(root, cx.vnode(node), 1, 0));
			} else {
				// create a document-fragment by default!
				var doc = t.bind(cx)();
				var _root = cx.vnode(node, doc, 1, 0);
				return doc.concatMap(function (doc) {
					doc = doc.push([0, _root.inode]);
					var next = doc.first();
					return next ? just(doc.vnode(next, doc, doc.depth + 1, 0)) : just();
				});
			}
		}
		if (typeof node.inode === "function") {
			// NOTE never bind to current node.cx, but purposely allow cross-binding
			return d.bind(cx)(node).concatMap(function (node) {
				var next = node.first();
				return next ? just(node.vnode(next, node, node.depth + 1, 0)) : just();
			});
		}
		return just(node);
	});
}

function _d(type, children) {
	const cx = this.vnode ? this : inode;
	const node = cx.vnode(cx.emptyINode(type, "#document"), null, 0);
	return just(children).concatMap(c => (0, _rxjs.isObservable)(c) ? c : (0, _vnode.isVNode)(c) ? just(c) : (0, _construct.x)(c)).concatMap(child => child.inode(node)).reduce((node, child) => node.modify(child), node);
}

function d(children) {
	var cx = this && this.vnode ? this : inode;
	return _d.bind(cx)(9, children);
}

function t(children) {
	var cx = this && this.vnode ? this : inode;
	return _d.bind(cx)(11, children);
}