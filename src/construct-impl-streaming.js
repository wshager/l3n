import { map, concatMap, reduce } from "rxjs/operators";

import { isVNode } from "./vnode";

import vnode from "./faux-vnode";

import just from "./just";

//import { isQName } from "./qname";

export function _n(type, name, children) {
	// Observable containing VNodes or strings
	// if either of the possibilities still contain Observables, they should be flattened elsewhere...
	return vnode(function (parent, ref) {
		/*var ns;
		if (type == 1) {
			if (isQName(name)) {
				ns = name;
				name = name.name;
			} else if (/:/.test(name)) {
				// TODO where are the namespaces?
			}
		}*/
		const parentIsCx = parent.__vnode_context;
		// convert to real VNode instance
		var node = parent.vnode(parent.create(type, name), parentIsCx ? null : parent, parentIsCx ? 0 : parent.depth + 1, 0, type);
		// create an inode from each child by calling the inode function on the faux VNode
		return children.pipe(
			// first test if node is observable, then if it's a VNode, else default to text
			concatMap(c => just(isVNode(c) ? typeof c.node == "function" ? c.node(node) : c : _v(3,c+"").node(node))),
			reduce((node,c) => node.modify(c,ref),node)
		);
	}, type, name);
}

export function _a(name, child) {
	return vnode(parent => {
		// provide a provisional entry in the parent (without a value)
		var node = parent.vnode(parent.create(2,name), parent);
		// node is an attr node /w child as $val
		return child.pipe(
			concatMap(child => node.modify(isVNode(child) ? typeof child.node == "function" ? child.node(node) : child : _v(3,child+"").node(node)))
		);
	}, 2, name);
}

export function _v(type, val) {
	return vnode(
		// set by type, not by key (for attrs the keys are already filled in by pair)
		parent => val.pipe(map(val => parent.vnode(parent.create(type,val), parent))),
		type,
		null,
		val
	);
}
