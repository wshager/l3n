"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.isDirect = exports.isClose = exports.isBranch = exports.isLeaf = undefined;
exports.fromStream = fromStream;

var _rxjs = require("rxjs");

var _inode2 = require("./inode");

var _vnode = require("./vnode");

/*
const constructormap = {
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
*/

class Nil {
	valueOf() {
		return null;
	}
	toString() {
		return "null";
	}
}

const isLeaf = exports.isLeaf = function isLeaf(type) {
	return type == 2 || type == 3 || type == 4 || type == 7 || type == 8 || type == 10 || type == 12 || type == 16;
};
const isBranch = exports.isBranch = function isBranch(type) {
	return type == 1 || type == 5 || type == 6 || type == 9 || type == 11 || type == 14 || type == 15;
};

const isClose = exports.isClose = type => type == 17;

const isDirect = exports.isDirect = type => type == 18;

class VNodeBuffer {
	constructor(nodes = []) {
		this.nodes = nodes;
	}
	add(v) {
		this.nodes.unshift(v);
	}
	count() {
		return this.nodes.length;
	}
	flush($o, count = 1) {
		let s = this.count();
		while (s >= count) {
			//console.log("FLUSH",s,count);
			$o.next(this.nodes.pop());
			--s;
		}
	}
}

function fromStream($s, bufSize = 1) {
	let _inode = _inode2.inode.emptyINode(11);
	let d = new _vnode.VNode(_inode2.inode, _inode, 11);
	const cx = this && this.hasOwnProperty("vnode") ? this : _inode2.inode;
	let ndepth = 0,
	    stack = [],
	    open = [11],
	    parents = [d],
	    openTuples = {},
	    buffered = null,
	    buf = new VNodeBuffer();
	const checkStack = () => {
		var l = stack.length;
		if (!l) return;
		var type = stack[0];
		var ol = open.length - 1;
		var last = open[ol],
		    parent = parents[ol];
		// buffered is used to add attributes to elements before they're emitted
		// here buffered is released before anything else is processed (except attrs)
		if (last == 1 && buffered !== null && type != 2) {
			// console.log("buf",buffered.name);
			buf.add(buffered);
			buffered = null;
		}
		if (isDirect(type)) {
			stack = [];
			return buf.add(new _vnode.Direct(parent));
		} else if (isClose(type)) {
			open.pop();
			parents.pop();
			//console.log("closing",ndepth,parent.inode);
			--ndepth;
			stack = [];
			return buf.add(new _vnode.Step(parent));
		} else {
			var _inode = void 0,
			    name = void 0,
			    key = void 0,
			    _isBranch = isBranch(type);
			if (_isBranch) {
				ndepth++;
				switch (type) {
					case 1:
						{
							name = stack[1];
							_inode = { $type: type, $name: name, $children: [] };
							if (last == 6) {
								// emit inode /w key
								key = openTuples[ndepth];
								//console.log("picked up tuple",ndepth,key);
								openTuples[ndepth] = undefined;
							}
							if (parent) parent.push([key, _inode]);
							open.push(type);
							// TODO use cx.vnode()
							var _depth = parent ? parent.depth + 1 : 1;
							var _node = new _vnode.VNode(cx, _inode, _inode.$type, name, key, isLeaf(type) ? _inode.valueOf() : null, parent, _depth, parent ? parent.count() : 0, parent ? parent.callCount() : 0);
							// buffer attributes
							buffered = _node;
							//console.log("opening element",ndepth,name, buffered);
							parents.push(_node);
							stack = [];
							return;
						}
					case 9:
						name = "#document";
						_inode = { $name: name, $children: [] };
						break;
					case 11:
						name = "#document-fragment";
						_inode = { $name: name, $children: [] };
						break;
					case 14:
						name = stack[1];
						_inode = { $name: name, $args: [], $call_args: [] };
						break;
					case 15:
						_inode = { $name: name, $args: [], $call_args: [] };
						break;
					case 5:
						_inode = []; //{$type:type,$children:[]};
						break;
					case 6:
						// never emit until all tuples are closed
						_inode = {};
						break;
				}
				if (last == 6) {
					// must be an open tuple
					key = openTuples[ndepth - 1];
					openTuples[ndepth - 1] = undefined;
					//console.log("picked up tuple",ndepth,key);
				}
				if (parent) {
					parent.push([key, _inode]);
				}
				open.push(type);
			} else {
				if (type == 2) {
					// new model:
					// - create tuple inode
					// - don't emit tuple, but tuple value /w key
					openTuples[ndepth] = stack[1];
					//console.log("opening tuple",ndepth,stack[1]);
					stack = [];
					return;
				} else {
					var value = stack[1];
					if (type == 12) value = JSON.parse(value);
					_inode = value === null ? new Nil() : new value.constructor(value);
					if (openTuples[ndepth] !== undefined) {
						key = openTuples[ndepth];
						//console.log("picked up tuple",ndepth,key);
						// NOTE Don't put away your tuple Harry, they might come back...
						//openTuples[ndepth] = undefined;
						if (last == 6) {
							if (parent) {
								if (parent.has(key)) {
									parent.set(key, parent.get(key) + " " + _inode);
								} else {
									parent.push([key, _inode]);
								}
							}
						} else if (last == 1) {
							parent.attr(key, value);
							stack = [];
							return;
						} else {
							// error
						}
					} else {
						if (parent) {
							parent.push([null, _inode]);
						}
					}
				}
			}
			stack = [];
			var depth = parent ? parent.depth + 1 : type == 9 || type == 11 ? 0 : 1;
			var node = new _vnode.VNode(cx, _inode, type, name, key, isLeaf(type) ? _inode.valueOf() : null, parent, depth, parent ? parent.count() : 0, parent ? parent.callCount() : 0);
			if (_isBranch) {
				parents.push(node);
			}
			//console.log("buf",node.name);
			buf.add(node);
		}
	};
	return _rxjs.Observable.create($o => {
		return $s.subscribe({
			next: function next(cur) {
				// this will be the new version of streaming-fromL3!
				if (typeof cur == "number") {
					try {
						checkStack();
					} catch (err) {
						return $o.error(err);
					}
					buf.flush($o, bufSize);
				}
				stack.push(cur);
			},
			complete: function complete() {
				try {
					checkStack();
				} catch (err) {
					return $o.error(err);
				}
				// flush all
				buf.flush($o);
				$o.complete();
			}
		});
	});
}