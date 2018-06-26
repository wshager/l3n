import { isObservable, of } from "rxjs";

import { isVNode } from "./vnode";

import { x } from "./construct";

import * as inode from "./inode";

const just = $o => isObservable($o) ? $o : of($o);

export function ensureDoc($node) {
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
	return just(children).concatMap(c => isObservable(c) ? c : isVNode(c) ? just(c) : x(c))
		.concatMap(child => child.inode(node)).reduce((node, child) => node.modify(child), node);
}

export function d(children) {
	var cx = this && this.vnode ? this : inode;
	return _d.bind(cx)(9, children);
}

export function t(children) {
	var cx = this && this.vnode ? this : inode;
	return _d.bind(cx)(11, children);
}
