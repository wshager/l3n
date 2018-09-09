/**
 * Traversal
 * @module traverse
 */

import { Close } from "./vnode";

import { ensureDoc } from "./doc";

import { mergeMap } from "rxjs/operators";


/**
 * Next-sibling based traversal
 * @private
 * @param  {Observable} $node [description]
 * @return {Observable}       [description]
 */
const _traverseNextNode = $node => $node.pipe(mergeMap(node => {
	const ret = [];
	while (node) {
		ret.push(node);
		node = nextNode(node);
	}
	return ret;
}));

/**
 * Used for closer-aware contexts (e.g. linked list)
 * @private
 * @param  {Observable} $node [description]
 * @return {Observable}       [description]
 */
const _traverseVNodeNext = $node => $node.pipe(mergeMap(node => {
	const ret = [];
	while (node) {
		ret.push(node);
		node = node.next(node);
	}
	return ret;
}));


/**
 * Traverses a document in depth-first (AKA "document") order
 * In addition to every node in the document, a special `Close` node is emitted after every traversed branch.
 * @param  {any} $node  (faux) VNode, Observable or any node constructed within the bound context
 * @return {Observable} An Observable stream emitting VNodes
 */
export function traverse($node) {
	var cx = this;
	$node = ensureDoc.bind(cx)($node);
	return cx.__vnode_context == "triply" ? _traverseVNodeNext($node) : _traverseNextNode($node);
}

export default traverse;

// NOTE nextNode is never eligable for seqs, but it may be exposed for other purposes
function nextNode(vnode /* VNode */) {
	let type = vnode.type,
		node = vnode.node,
		parent = vnode.parent,
		indexInParent = vnode.indexInParent || 1;
	var depth = vnode.depth || 0;
	// FIXME improve check
	if (type != 17 && (type == 1 || type == 5 || type == 6 || type == 14 || type == 15) && vnode.count() === 0) {
		return new Close(vnode);
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
			vnode = new Close(vnode);
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
