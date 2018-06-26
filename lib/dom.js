"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getType = undefined;
exports.value = value;
exports.vnode = vnode;
exports.emptyINode = emptyINode;
exports.emptyAttrMap = emptyAttrMap;
exports.next = next;
exports.push = push;
exports.set = set;
exports.removeChild = removeChild;
exports.cached = cached;
exports.keys = keys;
exports.values = values;
exports.finalize = finalize;
exports.setAttribute = setAttribute;
exports.getAttribute = getAttribute;
exports.count = count;
exports.first = first;
exports.last = last;
exports.attrEntries = attrEntries;
exports.modify = modify;

var _vnode = require("./vnode");

var _dom = require("./dom");

var cx = _interopRequireWildcard(_dom);

require("./shim");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// import self!
const filter = (...a) => l => Array.prototype.filter.apply(l, a);

// helpers ---------------


const wsre = /^[\t\n\r ]*$/;
const ignoreWS = x => x.nodeType != 3 || !wsre.test(x.textContent);
const filterWS = filter(ignoreWS);

const l3re = /^l3-(e?)(a?)(x?)(r?)(l?)(m?)(p?)(c?)()()(d?)()()(f?)$/;
const getL3Type = name => {
	return parseInt(name.replace(l3re, function () {
		for (var i = 1; i < arguments.length; i++) {
			if (arguments[i]) return i;
		}
	})) | 0;
};

var getQName = function getQName(inode, indexInParent) {
	var nodeType = inode.nodeType;
	var nodeName = inode.nodeName;
	if (nodeType == 1) {
		var l3Type = getL3Type(nodeName);
		//let type = l3Type | nodeType;
		var isL3 = l3Type !== 0;
		var attrs = inode.attributes;
		return isL3 ? attrs.name : nodeName;
	} else {
		return indexInParent + 1;
	}
};

//import { q } from "./qname";

// -----------------------
// Core API
// -----------------------


function value(type, value) {
	return value;
}

function vnode(inode, parent, depth, indexInParent) {
	var nodeType = inode.nodeType;
	var nodeName = inode.nodeName;
	let isElem = nodeType == 1;
	var l3Type = isElem ? getL3Type(nodeName) : 0;
	let type = l3Type | nodeType;
	var isL3 = isElem && l3Type !== 0;
	var attrs = isElem ? inode.attributes : null;
	var name, key, value;
	if (type == 1) {
		// if l3, nodeType != type
		name = isL3 ? attrs.name : nodeName;
	} else if (type == 2) {
		// no-op?
		key = inode.name;
	} else if (type == 5) {
		// no-op?
	} else if (type == 6) {
		// no-op?
	} else if (type == 3 || type == 8 || type == 12) {
		value = isL3 ? inode.textContent : inode.data;
	}
	// return vnode
	return new _vnode.VNode(cx, inode, type, name, key, value, parent, depth, indexInParent);
}

function emptyINode(type, name, attrs) {
	if (type == 9) {
		// XMLDocument doesn't make sense, right?
		return document.createDocumentFragment();
	} else if (type == 11) {
		return document.createDocumentFragment();
	} else {
		// TODO l3, persistent attrs?
		var elem = document.createElement(name);
		for (var k in attrs) {
			elem.attributes[k] = attrs[k];
		}
	}
}

function emptyAttrMap(init) {
	return init || {};
}

/*
export function get(inode,idx,type){
	type = type || _inferType(inode);
	if(type == 1 || type == 9){
		return _get(inode.$children,idx);
	}
	return inode[idx];
}
*/
function next(pinode, node, type) {
	//var idx = node.indexInParent;
	let inode = node.inode;
	if (type == 1 || type == 9 || type == 11) {
		// ignore WS-only!
		var nxt = inode.nextSibling;
		while (nxt && !ignoreWS(nxt)) {
			nxt = inode.nextSibling;
		}
		return nxt || undefined;
	}
}

function push(inode, kv, type) {
	if (type == 1 || type == 9 || type == 11) {
		inode.appendChild(kv[1]);
	}
	return inode;
}

function set(inode /*,key,val,type*/) {
	// used to restore immutable parents, never modifies mutable
	return inode;
}

function removeChild(inode, child, type) {
	if (type == 1 || type == 9 || type == 11) {
		// TODO removeChild et al.
		inode.removeChild(child);
	}
	return inode;
}

function cached() {}

function keys(inode, type) {
	if (type == 1 || type == 9 || type == 11) {
		let children = filterWS(inode.childNodes),
		    len = children.length,
		    keys = [];
		for (let i = 0; i < len; i++) {
			keys[i] = getQName(children[i], i);
		}
		return keys;
	}
	// TODO l3
	//if(type == 5) return range(inode.length).toArray();
	//if(type == 6) return Object.keys(inode);
	return [];
}

function values(inode, type) {
	if (type == 1 || type == 9 || type == 11) return filterWS(inode.childNodes);
	//if (type == 2) return [[inode.$name,inode.$value]];
	//if(type == 6) return Object.values(inode);
	//if (type == 8) return [inode.$comment];
	return inode;
}

function finalize(inode) {
	return inode;
}

function setAttribute(inode, key, val) {
	if (inode.nodeType == 1) inode.attributes[key] = val;
	return inode;
}

function getAttribute(inode, key) {
	if (inode.nodeType == 1) return inode.attributes[key];
}

function count(inode, type) {
	if (type == 1 || type == 9 || type == 11) {
		return filterWS(inode.childNodes).length;
	}
	// TODO l3
	return 0;
}

function first(inode, type) {
	if (type == 1 || type == 9 || type == 11) {
		return filterWS(inode.childNodes)[0];
	}
}

function last(inode, type) {
	if (type == 1 || type == 9 || type == 11) return filterWS(inode.childNodes).last();
}

function attrEntries(inode) {
	if (inode.nodeType == 1) {
		var i = [];
		try {
			for (var a of inode.attributes) {
				i[a.name] = a.value;
			}
		} catch (err) {
			// whatever
		}
		return i;
	}
	return [];
}

function modify(inode /*, node, ref, type*/) {
	return inode;
}

const getType = exports.getType = inode => {
	var nodeType = inode.nodeType;
	var nodeName = inode.nodeName;
	let isElem = nodeType == 1;
	return isElem ? getL3Type(nodeName) | 1 : nodeType;
};