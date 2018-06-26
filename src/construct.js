import { isObservable, of } from "rxjs";

import { isVNode } from "./vnode";

import { isQName } from "./qname";

// faux VNode
function vnode(inode, type, name, value) {
	return {
		inode: inode,
		type: type,
		name: name,
		value: value,
		__is_VNode: true
	};
}

function _n(type, name, children) {
	if (typeof name == "function") name = name();
	if (typeof children == "function") children = children();
	children = of(children).concatMap(function (c) {
		return isObservable(c) ? c : isVNode(c) ? of(c) : x(c);
	});
	return vnode(function (parent, ref) {
		var ns;
		if (type == 1) {
			if (isQName(name)) {
				ns = name;
				name = name.name;
			} else if (/:/.test(name)) {
				// TODO where are the namespaces?
			}
		}
		// convert to real VNode instance
		var node = parent.vnode(parent.emptyINode(type, name, type == 1 ? parent.emptyAttrMap() : undefined, ns), parent, parent.depth + 1, 0, type);
		return children.concatMap(function (child) {
			return child.inode(node);
		}).reduce(function (node, child) {
			return node.modify(child, ref);
		}, node);
	}, type, name);
}

function _a(name, child) {
	/*child = _seq.forEach((0, _seq.exactlyOne)(child),function (c) {
		return (0, _seq.isSeq)(c) ? c : (0, _access.isVNode)(c) ? (c) : x(c);
	});*/
	return vnode(function (parent) {
		var node = parent.vnode(parent.pair(name), parent);
		// node is an attr node /w child as $val
		return child.concatMap(function (child) {
			return child.inode(node);
		}).reduce(function (node, child) {
			return node.modify(child, name);
		}, node);
	}, 2, name);
}

function _v(type, val) {
	return vnode(function (parent) {
		return (val).map(function (val) {
			return parent.vnode(parent.value(type, val), parent);
		});
	}, type, null, val);
}

/**
 * Create a provisional element VNode.
 * Once the VNode's inode function is called, the node is inserted into the parent at the specified index
 * @param  {[type]} name     [description]
 * @param  {[type]} children [description]
 * @return {[type]}          [description]
 */
export function e(name, children) {
	return _n(1, name, children);
}

export function l(children) {
	return _n(5, null, children);
}

export function m(children) {
	return _n(6, null, children);
}

export function a(name, value) {
	return _a(name, value);
}

export function p(target, content) {
	return _v(7, target + " " + content);
}

export function x(value) {
	return _v(3, value);
}

export function c(value) {
	return _v(8, value);
}
