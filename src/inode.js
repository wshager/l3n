import { VNode } from "./vnode";

import multimap from "./multimap";

// import self!
import * as cx from "./inode";

// helpers ---------------

//import { q } from "./qname";



export function getType(inode) {
	if (inode === null) return 12;
	var cc = inode.constructor;
	if (cc == Array) {
		return 5;
	} else if (cc == Object) {
		if ("$children" in inode) {
			return inode.$name == "#document" ? 9 : inode.$name == "#document-fragment" ? 11 : 1;
		} else if (inode.$args) {
			return inode.$name !== undefined ? 14 : 15;
		} else if ("$value" in inode) {
			return 2;
		} else if ("$pi" in inode) {
			return 7;
		} else if ("$comment" in inode) {
			return 8;
		} else {
			return 6;
		}
	} else if (cc == Number || cc == Boolean) {
		return 12;
	}
	return 3;
}

/*
export function* _get(children, idx) {
	let len = children.length;
	for (let i = 0; i < len; i++) {
		if ((children[i].$name || i + 1) == idx) {
			yield children[i];
		}
	}
}
*/

function _elemToString(e) {
	var attrFunc = function attrFunc(z, kv) {
		return z += " " + kv[0] + "=\"" + kv[1] + "\"";
	};
	var str = "<" + e.$name;
	var ns = e.$ns;
	if (ns) str += " xmlns" + (ns.prefix ? ":" + ns.prefix : "") + "=\"" + ns.uri + "\"";
	str = Object.entries(e.$attrs).reduce(attrFunc, str);
	if (e.$children.length > 0) {
		str += ">";
		for(let c of e.$children){
			str += stringify(c);
		}
		str += "</" + e.$name + ">";
	} else {
		str += "/>";
	}
	return str;
}

// -----------------------

export function vnode(inode, parent, depth, indexInParent, type) {
	type = type || getType(inode);
	let name,
		key = inode.$key,
		value;
	if (type == 1 || type == 9 || type == 11 || type == 14) {
		name = inode.$name;
	} else if (type == 2) {
		name = inode.$name;
		value = inode.$value;
		// this will ensure tuples are iterated as values (name != key)
		if (inode.$key) {
			inode = inode.$value;
			type = getType(inode);
		}
	} else if (type == 7) {
		value = inode.$pi;
	} else if (type == 8) {
		value = inode.$comment;
	} else if (type == 3 || type == 12) {
		value = inode;
	} else if (type == 15) {
		name = "quote";
	}
	// return vnode
	return new VNode(cx, inode, type,
	//inode && inode.$ns ? q(inode.$ns.uri, name) : name,
		name, key, value, parent, depth, indexInParent);
}

export function emptyINode(type, name, attrs, ns) {
	var inode = type == 5 ? [] : {};
	if (type == 1 || type == 9 || type == 11) {
		inode.$name = name;
		inode.$attrs = attrs;
		inode.$ns = ns;
		inode.$children = [];
	} else if (type == 14) {
		inode.$name = name;
		inode.$args = [];
	} else if (type == 15) {
		inode.$args = [];
	}
	return inode;
}

export function emptyAttrMap(init) {
	return init || {};
}

export function pair(key, child) {
	return {
		$name: key,
		$value: child
	};
}

export function get(inode,idx,type){
	type = type || getType(inode);
	if(type == 6) {
		return inode[idx];
	}
	if(type == 14 || type == 15){
		return inode.$args[idx - 1];
	}
	return inode.$children[idx - 1];
}

export function has(inode,idx,type) {
	type = type || getType(inode);
	if(type == 6) {
		return idx in inode;
	}
	if(type == 14 || type == 15){
		return inode.$args[idx - 1];
	}
	return inode.$children[idx - 1];
}

/*
export function get(inode,idx,type,cache){
	type = type || getType(inode);
	if(type == 1 || type == 9){
		if(cache) return cache[idx];
		return _get(inode.$children,idx);
	}
	return inode[idx];
}
*/

var _nextOrPrev = function _nextOrPrev(inode, idx, type, dir) {
	type = type || getType(inode);
	if (type == 1 || type == 9 || type == 11) {
		return inode.$children[idx + dir];
	}
	if (type == 14 || type == 15) {
		return inode.$args[idx + dir];
	}
	if (type == 5) return inode[idx + dir];
	if (type == 6) {
		var entries = Object.entries(inode);
		var kv = entries[idx + dir];
		// pass tuple-wise
		return { $key: kv[0], $value: kv[1] };
	}
};

export function next(inode, indexInParent, type) {
	return _nextOrPrev(inode, indexInParent - 1, type, 1);
}

export function previous(inode, indexInParent, type) {
	return _nextOrPrev(inode, indexInParent - 1, type, -1);
}

export function push(inode, kv, type, has_call) {
	type = type || getType(inode);
	if (type == 1 || type == 9 || type == 11) {
		inode.$children.push(kv[1]);
	} else if (type == 14 || type == 15) {
		if(has_call) {
			inode.$call_args.push(kv[1]);
		} else {
			inode.$args.push(kv[1]);
		}
	} else if (type == 5) {
		inode.push(kv[1]);
	} else if (type == 6) {
		inode[kv[0]] = kv[1];
	}
	return inode;
}

export function set(inode,key,val,type) {
	// used to restore immutable parents, never modifies mutable
	type = type || getType(inode);
	if(type == 1 || type == 6) {
		inode[key] = val;
		return inode;
	} else if (type == 2) {
		inode.$value = val;
	} else if (type == 7) {
		return { $pi: val };
	} else if (type == 8) {
		return { $comment: val };
	}
	return inode;
}

export function removeChild(inode, child, type) {
	type = type || getType(inode);
	if (type == 1 || type == 9) {
		inode.$children.splice(child.indexInParent, 1);
	} else if (type == 5) {
		inode.splice(child.indexInParent, 1);
	} else if (type == 6) {
		delete inode[child.key];
	}
	return inode;
}

export function cached(inode, type) {
	type = type || getType(inode);
	if (type == 1 || type == 9 || type == 11) {
		let children = inode.$children,
			len = children.length,
			cache = multimap();
		for (var i = 0; i < len; i++) {
			cache.push([children[i].$name || i + 1, children[i]]);
		}
		return cache;
	}
	if (type == 5) {
		return {
			keys: function keys() {
				return inode.keys();
			}
		};
	}
	if (type == 6) {
		return {
			keys: function keys() {
				return Object.keys(inode);
			}
		};
	}
}

export function keys(inode, type) {
	type = type || getType(inode);
	if (type == 1 || type == 9) {
		let children = inode.$children,
			len = children.length,
			keys = [];
		for (var i = 0; i < len; i++) {
			keys[i] = children[i].$name || i + 1;
		}
		return keys;
	}
	if (type == 5) return inode.keys();
	if (type == 6) return Object.keys(inode);
	return [];
}

export function values(inode, type) {
	type = type || getType(inode);
	if (type == 1 || type == 9 || type == 11) return inode.$children;
	if (type == 14 || type == 15) return inode.$args;
	if (type == 2) return [[inode.$name, inode.$value]];
	if (type == 6)
		// tuple-wise
		return Object.entries(inode).map(function (kv) {
			return { $key: kv[0], $value: kv[1] };
		});
	if (type == 8) return [inode.$comment];
	return inode;
}

export function finalize(inode) {
	return inode;
}

export function count(inode, type) {
	type = type || getType(inode);
	if (type == 1 || type == 9 || type == 11) {
		return inode.$children.length;
	} else if (type == 14 || type == 15) {
		return inode.$args.length;
	} else if (type == 5) {
		return inode.length;
	} else if (type == 6) {
		return Object.keys(inode).length;
	}
	return 0;
}


export function callCount(inode, type) {
	type = type || getType(inode);
	if (type == 14 || type == 15) {
		return inode.$call_args.length;
	}
	return 0;
}

export function first(inode, type) {
	type = type || getType(inode);
	if (type == 1 || type == 9 || type == 11) {
		return inode.$children[0];
	} else if (type == 14 || type == 15) {
		return inode.$args[0];
	} else if (type == 5) {
		return inode[0];
	} else if (type == 6) {
		var entries = Object.entries(inode);
		var kv = entries[0];
		// pass tuple-wise
		return { $key: kv[0], $value: kv[1] };
	}
}

export function last(inode, type) {
	type = type || getType(inode);
	if (type == 1 || type == 9 || type == 11) return inode.$children.lastItem;
	if (type == 14 || type == 15) return inode.$args.lastItem;
	if (type == 5) return inode.lastItem;
	if (type == 6) {
		var entries = Object.entries(inode);
		var kv = entries.lastItem;
		// pass tuple-wise
		return { $key: kv[0], $value: kv[1] };
	}
}

export function attrEntries(inode) {
	if (inode.$attrs) return Object.entries(inode.$attrs);
	return [];
}

export function modify(inode, node, ref, type) {
	type = type || getType(inode);
	if (type == 1 || type == 9 || type == 11) {
		if (node.type == 2) {
			// TODO conversion rules!
			inode.$attrs[node.name] = node.inode.$value + "";
		} else if (ref !== undefined) {
			inode.$children.splice(ref.indexInParent, 0, node.inode);
		} else {
			inode.$children.push(node.inode);
		}
	} else if (type == 14 || type == 15) {
		if (ref !== undefined) {
			inode.$args.splice(ref.indexInParent, 0, node.inode);
		} else {
			inode.$args.push(node.inode);
		}
	} else if (type == 2) {
		// unfortunately refers back to self...
	} else if (type == 5) {
		if (ref !== undefined) {
			inode.splice(ref.indexInParent, 0, node.inode);
		} else {
			inode.push(node.inode);
		}
	} else if (type == 6) {
		inode[node.name] = node.inode.$value;
	}
	return inode;
}

export function toJS(inode,type) {
	type = type || getType(inode);
	if(type == 5) {
		return inode.map(x => toJS(x));
	} else if(type == 6) {
		return Object.entries(inode).reduce((acc,[k,v]) => {
			acc[k] = toJS(v);
			return acc;
		},{});
	} else {
		return inode.valueOf();
	}
}

export function stringify(inode, type, prettifier = x => x) {
	var json = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	var root = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

	var str = "";
	type = type || getType(inode);
	if (type == 1) {
		str += _elemToString(inode);
	} else if (type == 2) {
		str += "<l3:a name=\"" + inode.$key + "\">" + inode.$value + "</l3:a>";
	} else if (type == 5) {
		var _val = inode.map(function (c) {
			return stringify(c, 0, true, false);
		}).join("");
		str += "<l3:l" + (_val ? ">" + _val + "</l3:l>" : "/>");
	} else if (type == 6) {
		var _val3 = Object.entries(inode).map(function (c) {
			return stringify({ $key: c[0], $value: stringify(c[1], 0, true, false) }, 2, json, false);
		}).join("");
		str += "<l3:m" + (_val3 ? ">" + _val3 + "</l3:m>" : "/>");
	} else if (type == 14 || type == 15) {
		var _val4 = inode.$args.map(function (c) {
			return stringify(c, 0, true, false);
		}).join("");
		if(type == 14) {
			str += "<l3:f name=\"" + inode.$name + "\"" + (_val4 ? ">" + _val4 + "</l3:f>" : "/>");
		} else {
			str += "<l3:q" + (_val4 ? ">" + _val4 + "</l3:q>" : "/>");
		}
	} else {
		if (type == 7) {
			str += "<?" + inode.$pi + "?>";
		} else if (type == 8) {
			str += "<!--" + inode.$comment + "-->";
		} else {
			var _val2 = inode === null ? "null" : inode;
			str += type == 12 || json ? "<l3:x>" + _val2 + "</l3:x>" : _val2;
		}
	}
	return root ? prettifier(str) : str;
}
