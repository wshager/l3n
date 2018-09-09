// faux VNode
export function vnode(node, type, name, value,streaming = false) {
	return {
		node: node,
		type: type,
		name: name,
		value: value,
		streaming:streaming,
		__is_VNode: true
	};
}

export default vnode;
