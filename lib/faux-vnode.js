"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.vnode = vnode;
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

exports.default = vnode;
//# sourceMappingURL=faux-vnode.js.map