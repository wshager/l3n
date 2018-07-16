import t from "triply";

import { VNode } from "./vnode";

import multimap from "./multimap";

import { serialize } from "./doctype";

import { isBranch } from "./type";

import { append } from "./array-util";

// import self!
import * as cx from "./triply";

// helpers ---------------

//import { q } from "./qname";

const reservedNameKey = "$name"; //[1,2,9,11,14]
//const reservedChildrenKey = "$children"; //[1,9,11]
//const reservedArgsKey = "$args"; //[14,15]
const reservedValueKeys = {
	2:"$value",
	4:"$ref",
	7:"$pi",
	8:"$comment",
	10:"$doctype"
};

export const __vnode_context = "triply";

export function getType(node) {
	return node.$type;
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
		value = node.$value;
	} else {
		value = node[reservedValueKeys[type]];
	}
	return new VNode(cx, node, type, name, key, value, parent, depth, indexInParent);
}

export function create(type, nameOrValue) {
	const node = t.create({$type:type});
	if(type == 3 || type == 12) {
		node.$value = nameOrValue;
	} else if (type == 1 || type == 9 || type == 11 || type == 14) {
		node[reservedNameKey] = nameOrValue;
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

function _itemAt(iter,idx) {
	let i = 0;
	for(let x of iter) {
		if(i === idx) return x;
		i++;
	}
}

export function get(node,idx,type){
	type = type || getType(node);
	if(type == 6) {
		return node[idx];
	}
	return _itemAt(_children(node),idx);
}

export function has(node,idx,type) {
	type = type || getType(node);
	if(type == 6) {
		return idx in node;
	}
	return !!_itemAt(_children(node),idx);
}

var _nextOrPrev = function _nextOrPrev(node, idx, dir) {
	var entries = Object.entries(node);
	var kv = entries[idx + dir];
	// pass pair-wise
	return { $key: kv[0], $value: kv[1] };
};

export function next(node, vnode, type) {
	type == type || getType(node);
	return type == 6 ? _nextOrPrev(node, vnode.indexInParent - 1, 1) : t.nextSibling(node);
}

export function previous(node, vnode, type) {
	type == type || getType(node);
	return type == 6 ? _nextOrPrev(node, vnode.indexInParent - 1, -1) : t.nextSibling(node);
}

export function push(node, [k,v], type) {
	type = type || getType(node);
	if (type == 6) {
		node[k] = v;
	} else if(isBranch(type)) {
		t.appendChild(node,v);
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
	if (type == 1 || type == 9 || type == 11) {
		//node[reservedChildrenKey].splice(child.indexInParent, 1);
		t.removeChild(node,child);
	} else if (type == 5) {
		t.removeChild(node,child);
	} else if (type == 6) {
		delete node[child.key];
	} else if (type == 14 || type == 15) {
		t.removeChild(node,child);
	}
	return node;
}

function* _children(node) {
	let first = t.firstChild(node);
	while(first) {
		yield first;
		first = t.nextSibling(first);
	}
}

function map(iter,fn) {
	return reduce(iter,(z,x,i) => append(z,fn(x,i)),[]);
}

function reduce(iter,fn,z) {
	let i = 0;
	for(let x of iter) {
		z = fn(z,x,i++);
	}
	return z;
}

export function cached(node, type) {
	type = type || getType(node);
	if (type == 1 || type == 9 || type == 11) {
		let children = Array.from(_children(node)),
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
	if (type == 1 || type == 5 || type == 9 || type == 11 || type == 14 || type == 15) {
		return map(_children(node),(x,i) => x[reservedNameKey] || i);
	}
	if (type == 6) return Object.keys(node).filter(x => !dollarRE.test(x));
	return [];
}

export function values(node, type) {
	type = type || getType(node);
	if (type == 1 || type == 5 || type == 9 || type == 11 || type == 14 || type == 15) return _children(node);
	if (type == 2) return [[node[reservedNameKey], node[reservedValueKeys[2]]]];
	if (type == 6)
		// pair-wise
		return Object.entries(node).map(function (kv) {
			return { $key: kv[0], $value: kv[1] };
		});
	if(type == 3 || type == 12) return [node.$value];
	return [node[reservedValueKeys[type]]];
}

export function finalize(node) {
	return node;
}

export function count(node, type) {
	type = type || getType(node);
	if (type == 1 || type == 5 || type == 9 || type == 11 || type == 14 || type == 15) {
		return Array.from(_children(node)).length;
	} else if (type == 6) {
		return keys(node).length;
	}
	return 0;
}

export function first(node, type) {
	type = type || getType(node);
	if (type == 1 || type == 5 || type == 9 || type == 11 || type == 14 || type == 15) {
		return t.firstChild(node);
	} else if (type == 6) {
		var entries = Object.entries(node);
		var kv = entries[0];
		// pass pair-wise
		return { $key: kv[0], $value: kv[1] };
	}
}

export function last(node, type) {
	type = type || getType(node);
	if (type == 1 || type == 5 || type == 9 || type == 11 || type == 14 || type == 15) return t.lastChild(node);
	if (type == 6) {
		var entries = Object.entries(node);
		var kv = entries.lastItem;
		// pass pair-wise
		return { $key: kv[0], $value: kv[1] };
	}
}

const dollarRE = /^\$/;

export function entries(node, type) {
	type = type || getType(node);
	if(type == 5) return Array.from(_children(node)).entries();
	if (type == 1 || type == 6 || type == 9 || type == 11) return Object.entries(node).filter(([k]) => !dollarRE.test(k));
	return [];
}

export function modify(node, vnode, ref, type) {
	type = type || getType(node);
	if (type == 1 || type == 5 || type == 9 || type == 11 || type == 14 || type == 15) {
		if (vnode.type == 2) {
			// TODO conversion rules!
			node[vnode.name] = stringify(vnode.node.$value);
		} else if (ref !== undefined) {
			t.insertBefore(vnode.node,node);
		} else {
			t.appendChild(vnode.node,node);
		}
	} else if (type == 2) {
		node[reservedValueKeys[2]] = vnode.node;
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
		if(dollarRE.test(k)) return z;
		return z + (" " + k + "=\"" + v + "\"");
	};
	const name = e[reservedNameKey];
	var str = "<" + name;
	str = Object.entries(e).reduce(attrFunc, str);
	const cc = reduce(_children(e),(s,c) => s + stringify(c),"");
	if (cc) {
		str += ">"+cc;
		str += "</" + name + ">";
	} else {
		str += "/>";
	}
	return str;
}

// FIXME XML or HTML?
// TODO ref type
export function stringify(node, type, prettifier) {
	var str = "";
	type = type || getType(node);
	if (type == 1) {
		str += _elemToString(node);
	} else if(type == 9 || type == 11) {
		str = map(_children(node),c => stringify(c)).join("");
	} else if (type == 2) {
		str += "<l3:a name=\"" + node.$key + "\">" + stringify(node.$value) + "</l3:a>";
	} else if (type == 5) {
		const val = map(_children(node),c => stringify(c)).join("");
		str += "<l3:l" + (val ? ">" + val + "</l3:l>" : "/>");
	} else if (type == 6) {
		const val = entries(node).reduce(function (a,c) {
			return a + stringify({ $key: c[0], $value: stringify(c[1]) });
		},"");
		str += "<l3:m" + (val ? ">" + val + "</l3:m>" : "/>");
	} else if (type == 14 || type == 15) {
		const val = reduce(_children(node),(a,c) => a + stringify(c),"");
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
			const val = node.$value === null ? "null" : node.$value;
			str += type == 12 ? "<l3:x>" + val + "</l3:x>" : val;
		}
	}
	return prettifier ? prettifier(str) : str;
}
