import { Observable } from "rxjs";

import { VNode, Close } from "./vnode";

import { ensureDoc } from "./doc";

import * as cx from "./dom";

export function traverseDOM($node,d = document){
	$node = ensureDoc.bind(cx)($node);
	return Observable.create($o => {
		$node.subscribe({
			next(vnode){
				const t = d.createTreeWalker(vnode.node);
				const closers = new WeakMap();
				const isBranch = n => n.nodeType == 1 || n.nodeType == 9 || n.nodeType == 10 || n.nodeType == 11;
				const emitNode = n => {
					$o.next(new VNode(cx,n,n.nodeType, n.nodeName, n.nodeType == 2 ? n.nodeName : null, n.textContent, n.parentNode));
				};
				const close = n => {
					$o.next(new Close(n));
					if(closers.has(n)) {
						const parent = closers.get(n);
						closers.delete(n);
						close(parent);
					}
				};
				emitNode(t.currentNode);
				while(t.nextNode()) {
					const n = t.currentNode;
					emitNode(n);
					// if the node is a leaf or an empty branch, close its parent
					// else the node itself should close first
					// so don't close the parent yet, but move it to the closers map
					// and close it after this node closes
					let parent = n.parentNode;
					if(parent && parent.lastChild == n) {
						if(isBranch(n)) {
							if(!n.childNodes.length) {
								close(n);
								close(parent);
							} else {
								closers.set(n,parent);
							}
						} else {
							close(parent);
						}
					}
				}
			},
			complete(){
				$o.complete();
			},
			error(err) {
				$o.error(err);
			}
		});
	});
}

export default traverseDOM;
