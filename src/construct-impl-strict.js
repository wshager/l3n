import { isVNode } from "./vnode";

import { isObservable } from "rxjs";

import { _n as _n2, _a as _a2, _v as _v2 } from "./construct-impl-streaming";

import vnode from "./faux-vnode";

export function _n(type, name, children) {
	const len = children.length;
	// if there's only one "children" argument it could be an Array
	if(len == 1) {
		if(isObservable(children[0])) return _n2(type,name,children[0]);
		if(Array.isArray(children[0])) children = children[0];
	}
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
		return children.reduce((node,c) => node.modify(isVNode(c) ? typeof c.node == "function" ? c.node(node) : c : _v(3,c+"").node(node),ref),node);
	}, type, name);
}

export function _a(name, child) {
	if(isObservable(child)) return _a2(name,child);
	return vnode(parent => {
		// provide a provisional entry in the parent (without a value)
		var node = parent.vnode(parent.create(2,name), parent);
		// node is an attr node /w child as $val
		return node.modify(isVNode(child) ? typeof child.node == "function" ? child.node(node) : child : _v(3,child+"").node(node));
	}, 2, name);
}

export function _v(type, val) {
	if(isObservable(val)) return _v2(type,val);
	return vnode(
		// set by type, not by key (for attrs the keys are already filled in by pair)
		parent => parent.vnode(parent.create(type,val), parent),
		type,
		null,
		val
	);
}

export function _dt(qname,publicId,systemId) {
	return vnode(parent => parent.vnode(parent.create(10,{qname:qname,publicId:publicId,systemId:systemId}),parent,1,0),10);
}
