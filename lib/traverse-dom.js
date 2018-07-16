"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.traverseDOM = traverseDOM;
exports.default = void 0;

var _rxjs = require("rxjs");

var _vnode = require("./vnode");

var _doc = require("./doc");

var cx = _interopRequireWildcard(require("./dom"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * DOM Traversal
 * @module traverse-dom
 */

/**
 * Traverses a document in depth-first (AKA "document") order
 * @param  {any} $node  VNode, Observable or any node constructed within the DOM context
 * @return {Observable} An Observable stream emitting VNodes
 */
function traverseDOM($node, d = document) {
  $node = _doc.ensureDoc.bind(cx)($node);
  return _rxjs.Observable.create($o => {
    $node.subscribe({
      next(vnode) {
        const t = d.createTreeWalker(vnode.node);
        const closers = new WeakMap();

        const isBranch = n => n.nodeType == 1 || n.nodeType == 9 || n.nodeType == 10 || n.nodeType == 11;

        const emitNode = n => {
          $o.next(new _vnode.VNode(cx, n, n.nodeType, n.nodeName, n.nodeType == 2 ? n.nodeName : null, n.textContent, n.parentNode));
        };

        const close = n => {
          $o.next(new _vnode.Close(n));

          if (closers.has(n)) {
            const parent = closers.get(n);
            closers.delete(n);
            close(parent);
          }
        };

        emitNode(t.currentNode);

        while (t.nextNode()) {
          const n = t.currentNode;
          emitNode(n); // if the node is a leaf or an empty branch, close its parent
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
      },

      complete() {
        $o.complete();
      },

      error(err) {
        $o.error(err);
      }

    });
  });
}

var _default = traverseDOM;
exports.default = _default;
//# sourceMappingURL=traverse-dom.js.map