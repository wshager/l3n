import { concatMap } from "rxjs/operators";

import { getContext } from "./vnode";

import { _n, _v } from "./construct-impl-strict";

import just from "./just";

import * as inode from "./inode";

export function ensureDoc($node) {
	// FIXME if isVNode(node) use cx on node
	var cx = getContext(this,inode);
	return just($node).pipe(concatMap(function (node) {
		if (!node.node) {
			var type = cx.getType(node);
			if (type == 9 || type == 11) {
				var root = cx.first(node);
				return just(cx.vnode(root, cx.vnode(node), 1, 0));
			} else {
				// create a document-fragment by default!
				var doc = t.bind(cx)();
				var _root = cx.vnode(node, doc, 1, 0);
				return just(doc).pipe(concatMap(function (doc) {
					doc = doc.push([0, _root.node]);
					var next = doc.first();
					return next ? just(doc.vnode(next, doc, doc.depth + 1, 0)) : just();
				}));
			}
		}
		if (typeof node.node === "function") {
			// NOTE never bind to current node.cx, but purposely allow cross-binding
			return just(t.bind(cx)(node)).pipe(concatMap(function (node) {
				var next = node.first();
				return next ? just(node.vnode(next, node, node.depth + 1, 0)) : just();
			}));
		}
		return just(node);
	}));
}

export function d(...children) {
	return _n(9, "#document", children).node(getContext(this,inode));
}

export function t(...children) {
	return _n(11, "#document-fragment",children).node(getContext(this,inode));
}

export function doctype(name,publicId="",systemId=""){
	return _v(10,[name,publicId,systemId]);
}
