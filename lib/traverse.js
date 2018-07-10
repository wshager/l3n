"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.traverse = traverse;

var _rxjs = require("rxjs");

var _vnode = require("./vnode");

var _doc = require("./doc");

function traverse($node) {
	var cx = this;
	$node = _doc.ensureDoc.bind(cx)($node);
	return _rxjs.Observable.create($o => {
		return $node.subscribe({
			next(node) {
				while (node) {
					$o.next(node);
					node = nextNode(node);
				}
				$o.complete();
			},
			error(err) {
				$o.error(err);
			}
		});
	});
}

exports.default = traverse;

// FIXME nextNode is never eligable for seqs, so it shouldn't be exposed
// TODO write nextNode function: create observable for current node, subscribe and call nextNode

function nextNode(vnode /* VNode */) {
	let type = vnode.type,
	    node = vnode.node,
	    parent = vnode.parent,
	    indexInParent = vnode.indexInParent || 1;
	var depth = vnode.depth || 0;
	// FIXME improve check
	if (type != 17 && (type == 1 || type == 5 || type == 6 || type == 14 || type == 15) && vnode.count() === 0) {
		return new _vnode.Close(vnode);
	}
	if (type != 17 && vnode.count() > 0) {
		// if we can still go down, return firstChild
		depth++;
		indexInParent = 1;
		parent = vnode;
		node = vnode.first();
		// TODO handle arrays
		vnode = parent.vnode(node, parent, depth, indexInParent);
		//console.log("found first", vnode, depth,indexInParent, parent.count());
		return vnode;
	} else {
		// emergency exit
		if (!parent) return;
		// if there are no more children, return a 'Close' to indicate a close
		// it means we have to continue one or more steps up the path
		if (parent.count() == indexInParent) {
			//node = parent;
			depth--;
			vnode = vnode.parent;
			if (depth === 0 || !vnode) return;
			node = vnode.node;
			//console.log("found step", vnode.name, depth, indexInParent);
			vnode = new _vnode.Close(vnode);
			return vnode;
		} else {
			// return the next child
			indexInParent++;
			node = parent.next(vnode);
			if (node !== undefined) {
				vnode = parent.vnode(node, parent, depth, indexInParent);
				//console.log("found next", vnode.type, depth, indexInParent);
				return vnode;
			}
		}
	}
}
//# sourceMappingURL=traverse.js.map