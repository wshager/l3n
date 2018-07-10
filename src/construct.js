import { _n, _a, _v } from "./construct-impl-strict";

/**
 * Create a provisional element VNode.
 * Once the VNode's inode function is called, the node is inserted into the parent at the specified index
 * @param  {[type]} name     [description]
 * @param  {[type]} children [description]
 * @return {[type]}          [description]
 */
export function e(name, ...children) {
	return _n(1, name, children);
}

export function l(...children) {
	return _n(5, null, children);
}

export function m(...children) {
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

export function f(name,...args) {
	return _n(14, name, args);
}

export function q(...args) {
	return _n(15, null, args);
}
