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
exports.f = f;
exports.q = q;

var _constructImplStrict = require("./construct-impl-strict");

/**
 * Create a provisional element VNode.
 * Once the VNode's inode function is called, the node is inserted into the parent at the specified index
 * @param  {[type]} name     [description]
 * @param  {[type]} children [description]
 * @return {[type]}          [description]
 */
function e(name, ...children) {
	return (0, _constructImplStrict._n)(1, name, children);
}

function l(...children) {
	return (0, _constructImplStrict._n)(5, null, children);
}

function m(...children) {
	return (0, _constructImplStrict._n)(6, null, children);
}

function a(name, value) {
	return (0, _constructImplStrict._a)(name, value);
}

function p(target, content) {
	return (0, _constructImplStrict._v)(7, target + " " + content);
}

function x(value) {
	return (0, _constructImplStrict._v)(3, value);
}

function c(value) {
	return (0, _constructImplStrict._v)(8, value);
}

function f(name, ...args) {
	return (0, _constructImplStrict._n)(14, name, args);
}

function q(...args) {
	return (0, _constructImplStrict._n)(15, null, args);
}
//# sourceMappingURL=construct.js.map