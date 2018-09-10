"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._n = _n;
exports._a = _a;
exports._v = _v;

var _operators = require("rxjs/operators");

var _vnode = require("./vnode");

var _fauxVnode = _interopRequireDefault(require("./faux-vnode"));

var _just = _interopRequireDefault(require("./just"));

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import { isQName } from "./qname";
function _n(type, name, children) {
  // Observable containing VNodes or strings
  // if either of the possibilities still contain Observables, they should be flattened elsewhere...
  return (0, _fauxVnode.default)(function (parent, ref) {
    /*var ns;
    if (type == 1) {
    	if (isQName(name)) {
    		ns = name;
    		name = name.name;
    	} else if (/:/.test(name)) {
    		// TODO where are the namespaces?
    	}
    }*/
    const parentIsCx = parent.__vnode_context; // convert to real VNode instance

    var node = parent.vnode(parent.create(type, name), parentIsCx ? null : parent, parentIsCx ? 0 : parent.depth + 1, 0, type); // create an inode from each child by calling the inode function on the faux VNode

    return children.pipe( // first test if node is observable, then if it's a VNode, else default to text
    (0, _operators.concatMap)(c => (0, _just.default)((0, _vnode.isVNode)(c) ? typeof c.node == "function" ? c.node(node) : c : _v((0, _util.isString)(c) ? 3 : 12, c).node(node))), (0, _operators.reduce)((node, c) => node.modify(c, ref), node));
  }, type, name, null, true);
}

const _attrValue = (value, parentType) => {
  if (parentType == 1) return _v(3, value + "");
  return _v((0, _util.isString)(value) ? 3 : 12, value);
};

function _a(name, child) {
  return (0, _fauxVnode.default)(parent => {
    // provide a provisional entry in the parent (without a value)
    var node = parent.vnode(parent.create(2, name), parent); // node is an attr node /w child as $val

    return child.pipe((0, _operators.concatMap)(child => node.modify((0, _vnode.isVNode)(child) ? typeof child.node == "function" ? child.node(node) : child : _attrValue(child, parent.type).node(node))));
  }, 2, name, null, true);
}

function _v(type, val) {
  return (0, _fauxVnode.default)( // set by type, not by key (for attrs the keys are already filled in by pair)
  parent => (0, _just.default)(val).pipe((0, _operators.map)(val => parent.vnode(parent.create(type, val), parent))), type, null, val, true);
}
//# sourceMappingURL=construct-impl-streaming.js.map