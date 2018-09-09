/**
 * core interface to communicate with nodes
 * @type VNode
 */
export class VNode {
	/**
	 * Create VNode
	 * @param  {Object} cx            Document implementation context
	 * @param  {Object} node          Bare node
	 * @param  {Number} type          Node type
	 * @param  {String} name          Node name (if available)
	 * @param  {String} key           Node key (available on pairs in objects only)
	 * @param  {any} value            Node value (available on leafs only)
	 * @param  {VNode} parent         Parent in the document
	 * @param  {Number} deptht        Depth relative to the document
	 * @param  {Number} indexInParent Position relative to the parent
	 * @param  {Object} cache         Optional cache for fast access
	 * @return {void}
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
	 * @param  {Function} prettifier=x => x Optional prettifier function
	 * @return {String}               Output
	 */
	toString(prettifier = x => x) {
		return this.cx.stringify(this.node,this.type,prettifier);
	}
	/**
	 * Return JS (JSON) representation (by default this returns the bare document structure)
	 * @return {any} [description]
	 */
	toJS() {
		return this.cx.toJS(this.node,this.type);
	}
	/**
	 * Interface to context's count function
	 * @return {Number} Count of the node's entries or children
	 */
	count() {
		if (typeof this.node == "function") return 0;
		if (!this.cache) this.cache = this.cx.cached(this.node, this.type);
		return this.cx.count(this.node, this.type, this.cache);
	}
	/**
	 * Interface to context's keys function
	 * @return {Array} Keys of the node's entries or children
	 */
	keys() {
		if (!this.cache) this.cache = this.cx.cached(this.node, this.type);
		return this.cx.keys(this.node, this.type, this.cache);
	}
	/**
	 * Interface to context's values function
	 * @return {Array} The node's values, children or arguments
	 */
	values() {
		if (!this.cache) this.cache = this.cx.cached(this.node, this.type);
		return this.cx.values(this.node, this.type, this.cache);
	}
	/**
	 * Interface to context's first function
	 * @return {any} The node's first child, if any
	 */
	first() {
		//if (!this.cache) this.cache = this.cx.cached(this.node, this.type);
		return this.cx.first(this.node, this.type, this.cache);
	}
	attr(key,val) {
		return this.cx.attr(this.node,key,val,this.type);
	}
	/**
	 * Interface to context's last function
	 * @return {any} The node's last child, if any
	 */
	last() {
		if (!this.cache) this.cache = this.cx.cached(this.node, this.type);
		return this.cx.last(this.node, this.type, this.cache);
	}
	/**
	 * Interface to context's next function
	 * @return {any} The node's next child relative to the provided VNode, if any
	 */
	next(vnode) {
		if (!this.cache) this.cache = this.cx.cached(this.node, this.type);
		return this.cx.next(this.node, vnode, this.type, this.cache);
	}
	/**
	 * Interface to context's previous function
	 * @return {any} The node's previous child relative to the provided VNode, if any
	 */
	previous(vnode) {
		if (!this.cache) this.cache = this.cx.cached(this.node, this.type);
		return this.cx.previous(this.node, vnode, this.type, this.cache);
	}
	/**
	 * Interface to context's push function
	 * @return {VNode} pushes the tuple onto the node's entries or children
	 */
	push(kv) {
		// TODO cache invalidation
		this.node = this.cx.push(this.node, kv, this.type);
		return this;
	}
	/**
	 * Interface to context's set function
	 * @return {VNode} inserts the pair into a node that can contain pairs
	 */
	set(key, val) {
		this.node = this.cx.set(this.node, key, val, this.type);
		return this;
	}
	/**
	 * Interface to context's get function
	 * @return {any} retrieves a node's entry or child by key or index
	 */
	get(key) {
		return this.cx.get(this.node, key, this.type);
	}
	/**
	 * Interface to context's has function
	 * @return {Boolean} checks if a node has an entry or child with provided key or index
	 */
	has(key) {
		return this.cx.has(this.node, key, this.type);
	}
	/**
	 * Interface to context's removeChild function
	 * @return {VNode} removes a node's entry or child
	 */
	removeChild(child) {
		this.node = this.cx.removeChild(this.node, child, this.type);
		return this;
	}
	/**
	 * Interface to context's finalize function
	 * @return {VNode} finalizes a node that's eligible for transient mutations
	 */
	finalize() {
		this.node = this.cx.finalize(this.node);
		return this;
	}
	/**
	 * Interface to context's entries function
	 * @return {Array} retrieves a node's entries (i.e. attributes), if any
	 */
	entries() {
		return this.cx.entries(this.node);
	}
	/**
	 * Interface to context's modify function
	 * @return {VNode} modifies a node's entries or children, if any
	 */
	modify(node, ref) {
		this.node = this.cx.modify(this.node, node, ref, this.type);
		return this;
	}
	/**
	 * Interface to context's vnode function
	 * @return {VNode} allows for the creation of VNode with the same context bound it as this one
	 */
	vnode(node, parent, depth, indexInParent) {
		// hitch this on VNode for reuse
		return this.cx.vnode(node, parent, depth, indexInParent);
	}
	/**
	 * Interface to context's create function
	 * @return {any} allows for the creation of bare nodes within the bound context
	 */
	create(type, name, attrs) {
		return this.cx.create(type, name, attrs);
	}
}

/**
 * Create a VNode that explicitly closes a branch
 * @type {Close}
 */
export class Close {
	/**
	 * Create a Close
	 * @param  {VNode} node The VNode that is closed
	 * @return {void}
	 */
	constructor(node) {
		this.node = node;
		this.parent = node.parent;
		this.depth = node.depth;
		this.indexInParent = node.indexInParent;
		this.type = 17;
		this.__is_VNode = true;
	}
	/**
	 * Helper method to visualize the branch closer
	 * @return {String} Output
	 */
	toString() {
		return `Close {depth: ${this.node.depth}, closes: ${this.node}}`;
	}
}

/**
 * Test if VNode
 * @param  {any}  n Object to test
 * @return {Boolean}
 */
export const isVNode = n => !!n && n.__is_VNode;

/**
 * Helper function to determine the currently bound document implementation context
 * Returns the provided default context if none is bound
 * @param  {any} _this     Reference to functions this scope
 * @param  {Object} defaultCx Default document implementation context
 * @return {Object}           currently bound context
 */
export const getContext = (_this,defaultCx) => _this && _this.__vnode_context ? _this : defaultCx;
