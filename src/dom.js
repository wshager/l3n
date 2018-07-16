import { VNode } from "./vnode";

import { isBranch } from "./type";

import { serialize } from "./doctype";

import { range, filter, map } from "./array-util";

// import self!
import * as cx from "./dom";

// helpers ---------------
const wsre = /^[\t\n\r ]*$/;
const ignoreWS = x => x.nodeType != 3 || !wsre.test(x.textContent);
const filterWS = filter(ignoreWS);

const l3re = /^l3-(e?)(a?)(x?)(r?)(l?)(m?)(p?)(c?)()()(d?)()()(f?)(q?)$/;
const getL3Type = name => {
	const matches = l3re.exec(name.toLowerCase());
	if(!matches) return 0;
	for (let i = 1, l = matches.length; i < l; i++) {
		if (matches[i]) return i;
	}
	return 0;
};

const constructors = {
	1: "e",
	2: "a",
	3: "x",
	4: "r",
	5: "l",
	6: "m",
	7: "p",
	8: "c",
	12: "x",
	14: "f",
	15: "q"
};

var getQName = function getQName(node, indexInParent) {
	var nodeType = node.nodeType;
	var nodeName = node.nodeName;
	if (nodeType == 1) {
		var l3Type = getL3Type(nodeName);
		//let type = l3Type | nodeType;
		var isL3 = l3Type !== 0;
		var attrs = node.attributes;
		return isL3 ? attrs.name : nodeName;
	} else {
		return indexInParent + 1;
	}
};

//import { qname } from "./qname";

// -----------------------
// Core API
// -----------------------
export const __vnode_context = "dom";

export function vnode(node, parent, depth, indexInParent) {
	var nodeType = node.nodeType;
	var nodeName = node.nodeName;
	let isElem = nodeType == 1;
	var l3Type = isElem ? getL3Type(nodeName) : 0;
	let type = l3Type || nodeType;
	var isL3 = isElem && l3Type !== 0;
	var attrs = isElem ? node.attributes : null;
	var name, key, value;
	if(type == 1 || type == 14){
		// if l3, nodeType != type
		name = isL3 ? attrs.name : nodeName;
	} else if(type == 2) {
		// no-op?
		key = node.name;
	} else if (type == 5) {
		// no-op?
	} else if (type == 6) {
		// no-op?
	} else if(type == 3 || type == 8 || type == 12){
		value = isL3 ? node.textContent : node.data;
	}
	// return vnode
	return new VNode(
		cx,
		node,
		type,
		name,
		key,
		value,
		parent,
		depth,
		indexInParent
	);
}

// TODO relative document?
export function create(type, nameOrValue) {
	if(type == 9) {
		return document.implementation.createDocument(null,null);
	} else if(type == 10) {
		return document.implementation.createDocumentType(...nameOrValue);
	} else if(type == 11) {
		return document.createDocumentFragment();
	} else if(isBranch(type)){
		const name = type == 1 ? nameOrValue : "l3-" + constructors[type];
		var elem = document.createElement(name);
		if(type == 14) elem.name = nameOrValue;
		return elem;
	} else if(type == 2) {
		return document.createAttribute(nameOrValue);
	} else if(type == 3) {
		return document.createTextNode(nameOrValue);
	} else if(type == 4) {
		// provisional link type ;)
		const node = document.createElement("link");
		node.setAttribute("rel","import");
		node.setAttribute("href",nameOrValue);
		return node;
	} else if(type == 7) {
		return document.createProcessingInstruction(...nameOrValue);
	} else if(type == 8) {
		return document.createComment(nameOrValue);
	}
}


export function get(node,idx,type){
	type = type || getType(node);
	if(isBranch(type)){
		return filterWS(node.childNodes)[idx];
	}
	return node[idx];
}

export function has(node,idx,type){
	return !!get(node,idx,type);
}

export function next(node, vnode, type){
	type = type || getType(node);
	if(isBranch(type)) {
		// ignore WS-only!
		var nxt = vnode.nextSibling;
		while(nxt && !ignoreWS(nxt)){
			nxt = vnode.nextSibling;
		}
		return nxt || undefined;
	}
}

export function previous(node, vnode, type){
	type = type || getType(node);
	if(isBranch(type)) {
		// ignore WS-only!
		var prv = vnode.previousSibling;
		while(prv && !ignoreWS(prv)){
			prv = vnode.previousSibling;
		}
		return prv || undefined;
	}
}

export function push(node,kv,type){
	type = type || getType(node);
	if(isBranch(type)){
		node.appendChild(kv[1]);
	}
	return node;
}

export function set(node,key,val,type){
	type = type || getType(node);
	if(type == 1) {
		node.setAttribute(key,val);
	} else if(type == 6) {
		const attr = document.createElement("l3-a");
		attr.setAttribute("name", key);
		attr.appendChild(val);
		node.appendChild(attr);
	}
	return node;
}

export function removeChild(node,vchild,type){
	if(isBranch(type)){
		node.removeChild(vchild.node);
	}
	return node;
}

export function cached() {
}

export function keys(node,type){
	if(type == 1 || type == 9 || type == 11 || type == 14 || type == 15) {
		let children = filterWS(node.childNodes), len = children.length, keys = [];
		for(let i = 0; i<len; i++){
			keys[i] = getQName(children[i],i);
		}
		return keys;
	}
	// TODO l3
	if(type == 5) return range(filterWS(node.childNodes).length).toArray();
	if(type == 6) return map(c => c.getAttribute("name"))(filterWS(node.childNodes));
	return [];
}

export function values(node,type){
	if(type == 1 || type == 9 || type == 11) return filterWS(node.childNodes);
	//if (type == 2) return [[node.$name,node.$value]];
	//if(type == 6) return Object.values(node);
	//if (type == 8) return [node.$comment];
	return node;
}

export function finalize(node){
	return node;
}

export function count(node, type){
	type = type || getType(node);
	if(isBranch(type)){
		return filterWS(node.childNodes).length;
	}
	// TODO l3
	return 0;
}

export function first(node,type){
	type = type || getType(node);
	if(type == 1 || type == 9 || type == 11){
		return filterWS(node.childNodes)[0];
	}
}

export function last(node,type){
	type = type || getType(node);
	if(type == 1 || type == 9 || type == 11) return filterWS(node.childNodes).lastItem;
}

export function entries(node, type){
	type = type || getType(node);
	if(type == 1) {
		var i = [];
		try {
			for(var a of node.attributes){
				i[a.name] = a.value;
			}
		} catch(err) {
			// whatever
		}
		return i;
	}
	return [];
}

export function modify(node, vnode, ref, type){
	type = type || getType(node);
	if (type == 2) {
		// insert faux data
		node.$value = vnode.node;
	} else if (type == 6) {
		const attr = document.createElement("l3-a");
		attr.setAttribute("name", vnode.key);
		attr.appendChild(vnode.node.$value);
		node.appendChild(attr);
	} else if(isBranch(type)) {
		if (vnode.type == 2) {
			// TODO conversion rules!
			const attr = vnode.node;
			attr.value = attr.$value.textContent;
			node.setAttributeNode(attr);
		} else if (ref !== undefined) {
			node.insertBefore(vnode.node,ref.node);
		} else {
			node.appendChild(vnode.node);
		}
	}
	return node;
}

export function stringify(node,type){
	type = type || getType(node);
	if(type == 9 || type == 11) {
		return map(c => stringify(c))(node.childNodes).join("");
	} else if(isBranch(type)) {
		return node.outerHTML;
	} else if(type == 10) {
		return `<!DOCTYPE ${serialize(node.name,node.publicId,node.systemId)}>`;
	} else {
		const text = node.textContent;
		if(type == 7) return `<?${text}?>`;
		if(type == 8) return `<!--${text}-->`;
		if(type == 12) return `<l3-x>${text}</l3-x>`;
		return text;
	}
}

export const getType = node => {
	var nodeType = node.nodeType;
	var nodeName = node.nodeName;
	let isElem = nodeType == 1;
	return isElem ? getL3Type(nodeName) || 1 : nodeType;
};
