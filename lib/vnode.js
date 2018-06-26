"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
class VNode {
	constructor(cx, inode, type, name, key, value, parent, depth, indexInParent, indexInCall, cache) {
		this.cx = cx;
		this.inode = inode;
		this.type = type;
		this.name = name;
		this.key = key;
		this.value = value;
		this.parent = parent;
		this.depth = depth | 0;
		this.indexInParent = indexInParent;
		this.indexInCall = indexInCall;
		this.cache = cache;
		this.__is_VNode = true;
	}
	toString() {
		return this.cx.stringify(this.inode, this.type);
	}
	toJS() {
		return this.cx.toJS(this.inode, this.type);
	}
	count() {
		if (typeof this.inode == "function") return 0;
		if (!this.cache) this.cache = this.cx.cached(this.inode, this.type);
		return this.cx.count(this.inode, this.type, this.cache);
	}
	callCount() {
		if (typeof this.inode == "function") return 0;
		if (!this.cache) this.cache = this.cx.cached(this.inode, this.type);
		return this.cx.callCount(this.inode, this.type, this.cache);
	}
	keys() {
		if (!this.cache) this.cache = this.cx.cached(this.inode, this.type);
		return this.cx.keys(this.inode, this.type, this.cache);
	}
	values() {
		if (!this.cache) this.cache = this.cx.cached(this.inode, this.type);
		return this.cx.values(this.inode, this.type, this.cache);
	}
	first() {
		if (!this.cache) this.cache = this.cx.cached(this.inode, this.type);
		return this.cx.first(this.inode, this.type, this.cache);
	}
	last() {
		if (!this.cache) this.cache = this.cx.cached(this.inode, this.type);
		return this.cx.last(this.inode, this.type, this.cache);
	}
	next(node) {
		if (!this.cache) this.cache = this.cx.cached(this.inode, this.type);
		return this.cx.next(this.inode, node.indexInParent, this.type, this.cache);
	}
	previous(node) {
		if (!this.cache) this.cache = this.cx.cached(this.inode, this.type);
		return this.cx.previous(this.inode, node.indexInParent, this.type, this.cache);
	}
	// TODO cache invalidation
	push(kv) {
		this.inode = this.cx.push(this.inode, kv, this.type, this.__hasCall);
		return this;
	}
	set(key, val) {
		this.inode = this.cx.set(this.inode, key, val, this.type);
		return this;
	}
	get(key) {
		return this.cx.get(this.inode, key, this.type);
	}
	has(key) {
		return this.cx.has(this.inode, key, this.type);
	}
	removeChild(child) {
		this.inode = this.cx.removeChild(this.inode, child, this.type);
		return this;
	}
	finalize() {
		this.inode = this.cx.finalize(this.inode);
		return this;
	}
	attrEntries() {
		return this.cx.attrEntries(this.inode);
	}
	attr(k, v) {
		if (arguments.length == 1) return this.cx.getAttribute(this.inode, k);
		if (arguments.length === 0) {
			this.inode = this.cx.clearAttributes(this.inode);
		} else {
			this.inode = this.cx.setAttribute(this.inode, k, v);
		}
		return this;
	}
	modify(node, ref) {
		this.inode = this.cx.modify(this.inode, node, ref, this.type);
		return this;
	}
	// hitch this on VNode for reuse
	vnode(inode, parent, depth, indexInParent) {
		return this.cx.vnode(inode, parent, depth, indexInParent);
	}
	value(type, value) {
		return this.cx.value(type, value);
	}
	emptyINode(type, name, attrs, ns) {
		return this.cx.emptyINode(type, name, attrs, ns);
	}
	emptyAttrMap(init) {
		return this.cx.emptyAttrMap(init);
	}
	pair(key, inode) {
		return this.cx.pair(key, inode);
	}
}

exports.VNode = VNode;
class Step {
	constructor(node) {
		this.node = node;
		this.inode = node.inode;
		this.parent = node.parent;
		this.depth = node.depth;
		this.indexInParent = node.indexInParent;
		this.type = 17;
		this.__is_VNode = true;
	}
	toString() {
		return "Step {depth:" + this.node.depth + ", closes:" + this.node.name + "}";
	}
}

exports.Step = Step;
class Direct {
	constructor(node) {
		this.node = node;
		node.__hasCall = node.count();
		this.depth = node.depth;
		this.type = 18;
		this.__is_VNode = true;
	}
	toString() {
		return `Direct {depth:${this.node.depth}, calls:${this.node.name}}`;
	}
}

exports.Direct = Direct;
const isVNode = exports.isVNode = n => !!n && n.__is_VNode;