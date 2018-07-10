import { VNode } from "./vnode";

import multimap from "./multimap";

import { serialize } from "./doctype";

import { isBranch } from "./convert";

// import self!
import * as cx from "./inode";

// helpers ---------------

//import { q } from "./qname";

const reservedNameKey = "$name"; //[1,2,9,11,14]
const reservedChildrenKey = "$children"; //[1,9,11]
const reservedArgsKey = "$args"; //[14,15]
const reservedValueKeys = {
	2:"$value",
	4:"$ref",
	7:"$pi",
	8:"$comment",
	10:"$doctype"
};

const hashre = /^#/;

export const __vnode_context = "inode";

export function getType(node) {
	if (node === null) return 12;
	var cc = node.constructor;
	if (cc == Array) {
		return 5;
	} else if (cc == Object) {
		if (reservedChildrenKey in node) {
			const name = node[reservedNameKey];
			return !hashre.test(name) ? 1 : name == "#document" ? 9 : 11;
		} else if (reservedArgsKey in node) {
			return node[reservedNameKey] !== undefined ? 14 : 15;
		}
		for(let type in reservedValueKeys) {
			if(reservedValueKeys[type] in node) return type;
		}
		return 6;
	} else if (cc == Number || cc == Boolean) {
		return 12;
	}
	return 3;
}

// -----------------------

export function vnode(node, parent, depth, indexInParent, type) {
	type = type || getType(node);
	let name,key,value;
	if (isBranch(type)) {
		name = node[reservedNameKey];
	} else if (type == 2) {
		name = node[reservedNameKey];
		value = node[reservedValueKeys[2]];
		// this ensures pairs are iterated as their values (if no $key use attr node for construction)
		if (node.$key) {
			key = node.$key;
			node = value;
			type = getType(node);
		}
	} else if(type == 3 || type == 12) {
		value = node;
	} else {
		value = node[reservedValueKeys[type]];
	}
	return new VNode(cx, node, type, name, key, value, parent, depth, indexInParent);
}

export function create(type, nameOrValue) {
	if(type == 5) return [];
	if(type == 6) return {};
	if(type == 3 || type == 12) return nameOrValue;
	const node = {};
	if (type == 1 || type == 9 || type == 11) {
		node[reservedNameKey] = nameOrValue;
		node[reservedChildrenKey] = [];
	} else if(type == 2) {
		// value will be inserted later
		node[reservedNameKey] = nameOrValue;
		node[reservedValueKeys[2]] = void 0;
	} else {
		const val = type == 7 ? nameOrValue.join(" ") : type == 10 ? serialize(...nameOrValue) : nameOrValue;
		node[reservedValueKeys[type]] = val;
	}
	return node;
}

export function get(node,idx,type){
	type = type || getType(node);
	if(type == 6) {
		return node[idx];
	}
	if(type == 14 || type == 15){
		return node[reservedArgsKey][idx];
	}
	return node[reservedChildrenKey][idx];
}

export function has(node,idx,type) {
	type = type || getType(node);
	if(type == 5 || type == 6) {
		return idx in node;
	}
	if(type == 14 || type == 15){
		return idx in node[reservedArgsKey];
	}
	return idx in node[reservedChildrenKey];
}

var _nextOrPrev = function _nextOrPrev(node, idx, type, dir) {
	type = type || getType(node);
	if (type == 1 || type == 9 || type == 11) {
		return node[reservedChildrenKey][idx + dir];
	}
	if (type == 14 || type == 15) {
		return node[reservedArgsKey][idx + dir];
	}
	if (type == 5) return node[idx + dir];
	if (type == 6) {
		var entries = Object.entries(node);
		var kv = entries[idx + dir];
		// pass pair-wise
		return { $key: kv[0], $value: kv[1] };
	}
};

export function next(node, vnode, type) {
	return _nextOrPrev(node, vnode.indexInParent - 1, type, 1);
}

export function previous(node, vnode, type) {
	return _nextOrPrev(node, vnode.indexInParent - 1, type, -1);
}

export function push(node, [k,v], type) {
	type = type || getType(node);
	if (type == 1 || type == 9 || type == 11) {
		node[reservedChildrenKey].push(v);
	} else if (type == 14 || type == 15) {
		node[reservedChildrenKey].push(v);
	} else if (type == 5) {
		node.push(v);
	} else if (type == 6) {
		node[k] = v;
	}
	return node;
}

export function set(node,key,val,type) {
	type = type || getType(node);
	if(type == 1 || type == 6) {
		node[key] = val;
		return node;
	}
	return node;
}

export function removeChild(node, child, type) {
	type = type || getType(node);
	if (type == 1 || type == 9) {
		node[reservedChildrenKey].splice(child.indexInParent, 1);
	} else if (type == 5) {
		node.splice(child.indexInParent, 1);
	} else if (type == 6) {
		delete node[child.key];
	} else if (type == 14 || type == 15) {
		node[reservedArgsKey].splice(child.indexInParent, 1);
	}
	return node;
}

export function cached(node, type) {
	type = type || getType(node);
	if (type == 1 || type == 9 || type == 11) {
		let children = node[reservedChildrenKey],
			len = children.length,
			cache = multimap();
		for (var i = 0; i < len; i++) {
			cache.push([children[i][reservedNameKey] || i + 1, children[i]]);
		}
		return cache;
	}
	if (type == 5) {
		return {
			keys: function keys() {
				return node.keys();
			}
		};
	}
	if (type == 6) {
		return {
			keys: function keys() {
				return Object.keys(node);
			}
		};
	}
}

export function keys(node, type) {
	type = type || getType(node);
	if (type == 1 || type == 9) {
		let children = node[reservedChildrenKey],
			len = children.length,
			keys = [];
		for (var i = 0; i < len; i++) {
			keys[i] = children[i][reservedNameKey] || i + 1;
		}
		return keys;
	}
	if (type == 5) return node.keys();
	if (type == 6) return Object.keys(node);
	return [];
}

export function values(node, type) {
	type = type || getType(node);
	if (type == 1 || type == 9 || type == 11) return node[reservedChildrenKey];
	if (type == 14 || type == 15) return node[reservedArgsKey];
	if (type == 2) return [[node[reservedNameKey], node[reservedValueKeys[2]]]];
	if (type == 6)
		// pair-wise
		return Object.entries(node).map(function (kv) {
			return { $key: kv[0], $value: kv[1] };
		});
	if(type == 3 || type == 12) return [node];
	return [node[reservedValueKeys[type]]];
}

export function finalize(node) {
	return node;
}

export function count(node, type) {
	type = type || getType(node);
	if (type == 1 || type == 9 || type == 11) {
		return node[reservedChildrenKey].length;
	} else if (type == 14 || type == 15) {
		return node[reservedArgsKey].length;
	} else if (type == 5) {
		return node.length;
	} else if (type == 6) {
		return Object.keys(node).length;
	}
	return 0;
}

export function first(node, type) {
	type = type || getType(node);
	if (type == 1 || type == 9 || type == 11) {
		return node[reservedChildrenKey][0];
	} else if (type == 14 || type == 15) {
		return node[reservedArgsKey][0];
	} else if (type == 5) {
		return node[0];
	} else if (type == 6) {
		var entries = Object.entries(node);
		var kv = entries[0];
		// pass pair-wise
		return { $key: kv[0], $value: kv[1] };
	}
}

export function last(node, type) {
	type = type || getType(node);
	if (type == 1 || type == 9 || type == 11) return node[reservedChildrenKey].lastItem;
	if (type == 5) return node.lastItem;
	if (type == 6) {
		var entries = Object.entries(node);
		var kv = entries.lastItem;
		// pass pair-wise
		return { $key: kv[0], $value: kv[1] };
	}
	if (type == 14 || type == 15) return node[reservedArgsKey].lastItem;
}

export function entries(node, type) {
	type = type || getType(node);
	if(type == 5) return node.entries();
	if (type == 1 || type == 6 || type == 9 || type == 11) return Object.entries(node);
	return [];
}

export function modify(node, vnode, ref, type) {
	type = type || getType(node);
	if (type == 1 || type == 9 || type == 11) {
		if (vnode.type == 2) {
			// TODO conversion rules!
			node[vnode.name] = vnode.node.$value + "";
		} else if (ref !== undefined) {
			node[reservedChildrenKey].splice(ref.indexInParent, 0, vnode.node);
		} else {
			node[reservedChildrenKey].push(vnode.node);
		}
	} else if (type == 14 || type == 15) {
		if (ref !== undefined) {
			node[reservedArgsKey].splice(ref.indexInParent, 0, vnode.node);
		} else {
			node[reservedArgsKey].push(vnode.node);
		}
	} else if (type == 2) {
		node[reservedValueKeys[2]] = vnode.node;
	} else if (type == 5) {
		if (ref !== undefined) {
			node.splice(ref.indexInParent, 0, vnode.node);
		} else {
			node.push(vnode.node);
		}
	} else if (type == 6) {
		node[vnode.name] = vnode.node[reservedValueKeys[2]];
	}
	return node;
}

export function toJS(node,type) {
	type = type || getType(node);
	if(type == 5) {
		return node.map(x => toJS(x));
	} else if(type == 6) {
		return Object.entries(node).reduce((acc,[k,v]) => {
			acc[k] = toJS(v);
			return acc;
		},{});
	} else {
		return node.valueOf();
	}
}


function _elemToString(e) {
	const attrFunc = (z, [k,v]) => {
		if(/^\$/.test(k)) return z;
		return z + (" " + k + "=\"" + v + "\"");
	};
	const name = e[reservedNameKey];
	var str = "<" + name;
	str = Object.entries(e).reduce(attrFunc, str);
	const children = e[reservedChildrenKey];
	if (children.length > 0) {
		str += ">";
		for(let c of children){
			str += stringify(c);
		}
		str += "</" + name + ">";
	} else {
		str += "/>";
	}
	return str;
}

export function stringify(node, type, prettifier) {
	var str = "";
	type = type || getType(node);
	if (type == 1) {
		str += _elemToString(node);
	} else if(type == 9 || type == 11) {
		str = node[reservedChildrenKey].map(c => stringify(c)).join("");
	} else if (type == 2) {
		str += "<l3:a name=\"" + node.$key + "\">" + stringify(node.$value) + "</l3:a>";
	} else if (type == 5) {
		const val = node.map(c => stringify(c)).join("");
		str += "<l3:l" + (val ? ">" + val + "</l3:l>" : "/>");
	} else if (type == 6) {
		const val = Object.entries(node).reduce(function (a,c) {
			return a + stringify({ $key: c[0], $value: stringify(c[1]) });
		},"");
		str += "<l3:m" + (val ? ">" + val + "</l3:m>" : "/>");
	} else if (type == 14 || type == 15) {
		const val = node[reservedArgsKey].reduce((a,c) => a + stringify(c),"");
		if(type == 14) {
			str += "<l3:f name=\"" + node[reservedNameKey] + "\"" + (val ? ">" + val + "</l3:f>" : "/>");
		} else {
			str += "<l3:q" + (val ? ">" + val + "</l3:q>" : "/>");
		}
	} else {
		if (type == 7) {
			str += "<?" + node[reservedValueKeys[7]] + "?>";
		} else if (type == 8) {
			str += "<!--" + node[reservedValueKeys[8]] + "-->";
		} else if (type == 10) {
			str += "<!DOCTYPE "+node[reservedValueKeys[10]]+">";
		} else {
			const val = node === null ? "null" : node;
			str += type == 12 ? "<l3:x>" + val + "</l3:x>" : val;
		}
	}
	return prettifier ? prettifier(str) : str;
}
