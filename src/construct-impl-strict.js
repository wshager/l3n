import { isVNode } from "./vnode";

import { isObservable, of, from } from "rxjs";

import { _n as _n2, _a as _a2, _v as _v2 } from "./construct-impl-streaming";

import vnode from "./faux-vnode";

import { isString } from "./util";

export function _n(type, name, children) {
	const len = children.length;
	// if there's only one "children" argument it could be an Array
	if(len == 1) {
		const first = children[0];
		if(isObservable(first)) return _n2(type,name,first);
		if(isVNode(first) && first.streaming) return _n2(type,name,of(first));
		if(Array.isArray(first)) children = first;
	}
	for(let c of children) {
		if(isVNode(c) && c.streaming) return _n2(type,name,from(children));
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
		return children.reduce((node,c) => node.modify(isVNode(c) ? typeof c.node == "function" ? c.node(node) : c : _v(isString(c) ? 3 : 12,c).node(node),ref),node);
	}, type, name);
}

const _attrValue = (value,parentType) => {
	if(parentType == 1) return _v(3,value+"");
	return _v(isString(value) ? 3 : 12,value);
};

export function _a(name, child) {
	if(isObservable(child) || (isVNode(child) && child.streaming)) return _a2(name,child);
	return vnode(parent => {
		// provide a provisional entry in the parent (without a value)
		var node = parent.vnode(parent.create(2,name), parent);
		// node is an attr node /w child as $val
		return node.modify(isVNode(child) ? typeof child.node == "function" ? child.node(node) : child : _attrValue(child,parent.type).node(node));
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
