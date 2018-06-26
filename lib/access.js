"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.vdoc = vdoc;

var _rxjs = require("rxjs");

var _vnode = require("./vnode");

var _doc = require("./doc");

function vdoc($node) {
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

// FIXME nextNode is never eligable for seqs, so it shouldn't be exposed
// TODO write nextNode function: create observable for current node, subscribe and call nextNode
function nextNode(node /* VNode */) {
	let type = node.type,
	    inode = node.inode,
	    parent = node.parent,
	    indexInParent = node.indexInParent || 1;
	var depth = node.depth || 0;
	// FIXME improve check
	if (type != 17 && (type == 1 || type == 5 || type == 6 || type == 14 || type == 15) && node.count() === 0) {
		return new _vnode.Step(node);
	}
	if (type != 17 && node.count() > 0) {
		// if we can still go down, return firstChild
		depth++;
		indexInParent = 1;
		parent = node;
		inode = node.first();
		// TODO handle arrays
		node = parent.vnode(inode, parent, depth, indexInParent);
		//console.log("found first", node.type, depth,indexInParent);
		return node;
	} else {
		// emergency exit
		if (!parent) return;
		// if there are no more children, return a 'Step' to indicate a close
		// it means we have to continue one or more steps up the path
		if (parent.count() == indexInParent) {
			//inode = parent;
			depth--;
			node = node.parent;
			if (depth === 0 || !node) return;
			inode = node.inode;
			//console.log("found step", node.name, depth, indexInParent);
			node = new _vnode.Step(node);
			return node;
		} else {
			// return the next child
			indexInParent++;
			inode = parent.next(node);
			if (inode !== undefined) {
				node = parent.vnode(inode, parent, depth, indexInParent);
				//console.log("found next", node.type, depth, indexInParent);
				return node;
			}
		}
	}
}