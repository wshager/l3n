"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports._n = _n;
exports._a = _a;
exports._v = _v;
exports._dt = _dt;

var _vnode = require("./vnode");

var _rxjs = require("rxjs");

var _constructImplStreaming = require("./construct-impl-streaming");

var _fauxVnode = require("./faux-vnode");

var _fauxVnode2 = _interopRequireDefault(_fauxVnode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _n(type, name, children) {
	const len = children.length;
	// if there's only one "children" argument it could be an Array
	if (len == 1) {
		if ((0, _rxjs.isObservable)(children[0])) return (0, _constructImplStreaming._n)(type, name, children[0]);
		if (Array.isArray(children[0])) children = children[0];
	}
	return (0, _fauxVnode2.default)(function (parent, ref) {
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
		return children.reduce((node, c) => node.modify((0, _vnode.isVNode)(c) ? typeof c.node == "function" ? c.node(node) : c : _v(3, c + "").node(node), ref), node);
	}, type, name);
}

function _a(name, child) {
	if ((0, _rxjs.isObservable)(child)) return (0, _constructImplStreaming._a)(name, child);
	return (0, _fauxVnode2.default)(parent => {
		// provide a provisional entry in the parent (without a value)
		var node = parent.vnode(parent.create(2, name), parent);
		// node is an attr node /w child as $val
		return node.modify((0, _vnode.isVNode)(child) ? typeof child.node == "function" ? child.node(node) : child : _v(3, child + "").node(node));
	}, 2, name);
}

function _v(type, val) {
	if ((0, _rxjs.isObservable)(val)) return (0, _constructImplStreaming._v)(type, val);
	return (0, _fauxVnode2.default)(
	// set by type, not by key (for attrs the keys are already filled in by pair)
	parent => parent.vnode(parent.create(type, val), parent), type, null, val);
}

function _dt(qname, publicId, systemId) {
	return (0, _fauxVnode2.default)(parent => parent.vnode(parent.create(10, { qname: qname, publicId: publicId, systemId: systemId }), parent, 1, 0), 10);
}
//# sourceMappingURL=construct-impl-strict.js.map