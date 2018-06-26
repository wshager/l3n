"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.e = e;
exports.l = l;
exports.m = m;
exports.a = a;
exports.p = p;
exports.x = x;
exports.c = c;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _vnode = require("./vnode");

var _qname = require("./qname");

const just = $o => (0, _rxjs.isObservable)($o) ? $o : (0, _rxjs.of)($o);

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
	const len = children.length;
	if (len == 1) {
		children = children[0];
	}
	if (typeof name == "function") name = name();
	if (typeof children == "function") children = children();
	// convert to Observable
	if (Array.isArray(children)) children = (0, _rxjs.from)(children);
	children = just(children).pipe((0, _operators.concatMap)(c => (0, _rxjs.isObservable)(c) ? c : just((0, _vnode.isVNode)(c) ? c : x(c))));
	return vnode(function (parent, ref) {
		var ns;
		if (type == 1) {
			if ((0, _qname.isQName)(name)) {
				ns = name;
				name = name.name;
			} else if (/:/.test(name)) {
				// TODO where are the namespaces?
			}
		}
		// convert to real VNode instance
		var node = parent.vnode(parent.emptyINode(type, name, type == 1 ? parent.emptyAttrMap() : undefined, ns), parent, parent.depth + 1, 0, type);
		// create an inode from each child by calling the inode function on the faux VNode
		// then wrap all nodes into the parent by calling modify
		return children.pipe((0, _operators.concatMap)(child => child.inode(node)), (0, _operators.reduce)((node, child) => node.modify(child, ref), node));
	}, type, name);
}

function _a(name, child) {
	/*child = _seq.forEach((0, _seq.exactlyOne)(child),function (c) {
 	return (0, _seq.isSeq)(c) ? c : (0, _access.isVNode)(c) ? (c) : x(c);
 });*/
	child = just(child).pipe((0, _operators.concatMap)(c => (0, _rxjs.isObservable)(c) ? c : just((0, _vnode.isVNode)(c) ? c : x(c))));
	return vnode(parent => {
		// provide a provisional entry in the parent (without a value)
		var node = parent.vnode(parent.pair(name), parent);
		// node is an attr node /w child as $val
		return child.pipe((0, _operators.concatMap)(child => child.inode(node)), (0, _operators.reduce)((node, child) => node.modify(child), node));
	}, 2, name);
}

function _v(type, val) {
	return vnode(
	// set by type, not by key (for attrs the keys are already filled in by pair)
	parent => ((0, _rxjs.isObservable)(val) ? val : (0, _rxjs.of)(val)).pipe((0, _operators.map)(val => parent.vnode(parent.set(null, val), parent))), type, null, val);
}

/**
 * Create a provisional element VNode.
 * Once the VNode's inode function is called, the node is inserted into the parent at the specified index
 * @param  {[type]} name     [description]
 * @param  {[type]} children [description]
 * @return {[type]}          [description]
 */
function e(name, ...children) {
	return _n(1, name, children);
}

function l(...children) {
	return _n(5, null, children);
}

function m(...children) {
	return _n(6, null, children);
}

function a(name, value) {
	return _a(name, value);
}

function p(target, content) {
	return _v(7, target + " " + content);
}

function x(value) {
	return _v(3, value);
}

function c(value) {
	return _v(8, value);
}