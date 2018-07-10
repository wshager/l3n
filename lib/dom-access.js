"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.vdoc = vdoc;

var _rxjs = require("rxjs");

var _vnode = require("./vnode");

var _dom = require("./dom");

var dom = _interopRequireWildcard(_dom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function vdoc(node, d = document) {
	return _rxjs.Observable.create($o => {
		const t = d.createTreeWalker(node);
		const closers = new WeakMap();
		const isBranch = n => n.nodeType == 1 || n.nodeType == 9 || n.nodeType == 10 || n.nodeType == 11;
		const emitNode = n => {
			$o.next(new _vnode.VNode(dom, n, n.nodeType, n.nodeName, n.nodeType == 2 ? n.nodeName : null, n.textContent, n.parentNode));
		};
		const close = n => {
			$o.next(new _vnode.Step(n));
			if (closers.has(n)) {
				const parent = closers.get(n);
				closers.delete(n);
				close(parent);
			}
		};
		emitNode(t.currentNode);
		while (t.nextNode()) {
			const n = t.currentNode;
			emitNode(n);
			// if the node is a leaf or an empty branch, close its parent
			// else the node itself should close first
			// so don't close the parent yet, but move it to the closers map
			// and close it after this node closes
			let parent = n.parentNode;
			if (parent && parent.lastChild == n) {
				if (isBranch(n)) {
					if (!n.childNodes.length) {
						close(n);
						close(parent);
					} else {
						closers.set(n, parent);
					}
				} else {
					close(parent);
				}
			}
		}
		$o.complete();
	});
}