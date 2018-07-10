/**
 * core interface to communicate with nodes
 * @type VNode
 */
export class VNode {
	/**
	 * Create VNode
	 * @param  {Object} cx            [description]
	 * @param  {Object} node          [description]
	 * @param  {Number} type          [description]
	 * @param  {String} name          [description]
	 * @param  {String} key           [description]
	 * @param  {any} value         [description]
	 * @param  {VNode} parent        [description]
	 * @param  {Number} depth         [description]
	 * @param  {Number} indexInParent [description]
	 * @param  {Object} cache         [description]
	 * @return {void}               [description]
	 */
	constructor(cx, node, type, name, key, value, parent, depth, indexInParent, cache) {
		this.cx = cx;
		this.node = node;
		this.type = type;
		this.name = name;
		this.key = key;
		this.value = value;
		this.parent = parent;
		this.depth = depth | 0;
		this.indexInParent = indexInParent;
		this.cache = cache;
		this.__is_VNode = true;
	}
	/**
	 * Render XML representation of a VNode
	 * @param  {Function} [prettifier=x => x] Optional prettifier function
	 * @return {String}               Output
	 */
	toString(prettifier = x => x) {
		return this.cx.stringify(this.node,this.type,prettifier);
	}
	toJS() {
		return this.cx.toJS(this.node,this.type);
	}
	count() {
		if (typeof this.node == "function") return 0;
		if (!this.cache) this.cache = this.cx.cached(this.node, this.type);
		return this.cx.count(this.node, this.type, this.cache);
	}
	keys() {
		if (!this.cache) this.cache = this.cx.cached(this.node, this.type);
		return this.cx.keys(this.node, this.type, this.cache);
	}
	values() {
		if (!this.cache) this.cache = this.cx.cached(this.node, this.type);
		return this.cx.values(this.node, this.type, this.cache);
	}
	first() {
		if (!this.cache) this.cache = this.cx.cached(this.node, this.type);
		return this.cx.first(this.node, this.type, this.cache);
	}
	last() {
		if (!this.cache) this.cache = this.cx.cached(this.node, this.type);
		return this.cx.last(this.node, this.type, this.cache);
	}
	next(vnode) {
		if (!this.cache) this.cache = this.cx.cached(this.node, this.type);
		return this.cx.next(this.node, vnode, this.type, this.cache);
	}
	previous(vnode) {
		if (!this.cache) this.cache = this.cx.cached(this.node, this.type);
		return this.cx.previous(this.node, vnode, this.type, this.cache);
	}
	// TODO cache invalidation
	push(kv) {
		this.node = this.cx.push(this.node, kv, this.type);
		return this;
	}
	set(key, val) {
		this.node = this.cx.set(this.node, key, val, this.type);
		return this;
	}
	get(key) {
		return this.cx.get(this.node, key, this.type);
	}
	has(key) {
		return this.cx.has(this.node, key, this.type);
	}
	removeChild(child) {
		this.node = this.cx.removeChild(this.node, child, this.type);
		return this;
	}
	finalize() {
		this.node = this.cx.finalize(this.node);
		return this;
	}
	attrEntries() {
		return this.cx.attrEntries(this.node);
	}
	modify(node, ref) {
		this.node = this.cx.modify(this.node, node, ref, this.type);
		return this;
	}
	// hitch this on VNode for reuse
	vnode(node, parent, depth, indexInParent) {
		return this.cx.vnode(node, parent, depth, indexInParent);
	}
	create(type, name, attrs) {
		return this.cx.create(type, name, attrs);
	}
}

export class Close {
	constructor(node) {
		this.node = node;
		this.parent = node.parent;
		this.depth = node.depth;
		this.indexInParent = node.indexInParent;
		this.type = 17;
		this.__is_VNode = true;
	}
	toString() {
		return `Close {depth: ${this.node.depth}, closes: ${this.node}}`;
	}
}

export const isVNode = n => !!n && n.__is_VNode;

export const getContext = (_this,defaultCx) => _this && _this.__vnode_context ? _this : defaultCx;
