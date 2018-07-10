// faux VNode
export function vnode(node, type, name, value) {
	return {
		node: node,
		type: type,
		name: name,
		value: value,
		__is_VNode: true
	};
}

export default vnode;
