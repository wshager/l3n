"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vnode = vnode;
exports.default = void 0;

// faux VNode
function vnode(node, type, name, value) {
  return {
    node: node,
    type: type,
    name: name,
    value: value,
    __is_VNode: true
  };
}

var _default = vnode;
exports.default = _default;
//# sourceMappingURL=faux-vnode.js.map