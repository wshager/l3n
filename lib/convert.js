"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromVNodeStream = fromVNodeStream;
exports.toVNodeStreamCurried = exports.toVNodeStream = void 0;

var _rxjs = require("rxjs");

var inode = _interopRequireWildcard(require("./inode"));

var _vnode = require("./vnode");

var _type = require("./type");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/**
 * Stream conversion
 * @module convert
 */
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
/**
 * Convert an L3 stream directly to a VNode stream, constructing the document while traversing
 * An L3 stream is a sequence of L3 constants as integers, and names or values as strings (parsers are expected to emit this kind of stream).
 * @param  {Observable} $s       The L3 stream as an Observable
 * @param  {Number} [bufSize=1]  Optional buffer size. Use NaN or Infinity to buffer everything
 * @return {Observable}          The VNode stream as an Observable
 */


const toVNodeStream = ($s, props = {}) => toVNodeStreamCurried(props)($s);

exports.toVNodeStream = toVNodeStream;

const toVNodeStreamCurried = ({
  bufSize = 1,
  withAttrs = false
}) => $s => {
  // TODO fix bufSize = 0
  const cx = (0, _vnode.getContext)(void 0, inode); // create fragment node here; doc constructor expects children

  let d = cx.vnode(cx.create(11, "#document-fragment"), 11);
  let ndepth = 0,
      stack = [],
      open = [11],
      parents = [d],
      openPairs = {},
      buffered = null,
      buf = new VNodeBuffer();

  const checkStack = () => {
    var l = stack.length;
    if (!l) return;
    var type = stack[0];
    var ol = open.length - 1;
    var last = open[ol],
        parent = parents[ol]; // buffered is used to add attributes to elements before they're emitted
    // here buffered is released before anything else is processed (except attrs)

    if (last == 1 && buffered !== null && (withAttrs || type != 2)) {
      // console.log("buf",buffered.name);
      buf.add(buffered);
      buffered = null;
    }

    if ((0, _type.isClose)(type)) {
      open.pop();
      parents.pop(); //console.log("closing",ndepth,parent.node);

      --ndepth;
      stack = [];
      parent.finalize();
      return buf.add(new _vnode.Close(parent));
    } else {
      let node = void 0,
          name = void 0,
          key = void 0,
          _isBranch = (0, _type.isBranch)(type);

      if (_isBranch) {
        ndepth++;
        name = stack[1];

        switch (type) {
          case 1:
            {
              if (last == 6) {
                // must be an open pair
                key = openPairs[ndepth - 1];
                openPairs[ndepth - 1] = undefined; //console.log("picked up pair",ndepth,key);
              }

              node = cx.create(1, name);
              if (parent) parent.push([key, node]);
              open.push(type); // TODO use cx.vnode()

              let depth = parent ? parent.depth + 1 : 1;
              let vnode = new _vnode.VNode(cx, node, type, name, key, (0, _type.isLeaf)(type) ? node.valueOf() : null, parent, depth, parent ? parent.count() : 0); //let vnode = cx.vnode(node,parent,depth,parent ? parent.count() : 0,type);
              // buffer attributes

              buffered = vnode; //console.log("opening element",ndepth,name, buffered);

              parents.push(vnode);
              stack = [];
              return;
            }

          case 9:
            name = "#document";
            node = cx.create(9, name);
            break;

          case 11:
            name = "#document-fragment";
            node = cx.create(11, name);
            break;

          case 14:
          case 15:
          case 5:
          case 6:
            // never emit until all pairs are closed (Why?)
            node = cx.create(type, name);
            break;
        }

        if (last == 6) {
          // must be an open pair
          key = openPairs[ndepth - 1];
          openPairs[ndepth - 1] = undefined; //console.log("picked up pair",ndepth,key);
        }

        if (parent) {
          parent.push([key, node]);
        }

        open.push(type);
      } else {
        if (type == 2) {
          // new model:
          // - create pair inode
          // - don't emit pair, but pair value /w key
          openPairs[ndepth] = stack[1]; //console.log("opening pair",ndepth,stack[1]);

          stack = [];
          return;
        } else {
          let value = stack[1];
          if (type == 12) value = JSON.parse(value);
          node = cx.create(type, value);

          if (openPairs[ndepth] !== undefined) {
            key = openPairs[ndepth]; //console.log("picked up pair",ndepth,key);
            // NOTE unset pair! No seqs allowed in l3!

            openPairs[ndepth] = undefined;

            if (last == 6 || last == 1 && withAttrs) {
              if (parent) {
                if (parent.has(key)) {
                  parent.set(key, parent.get(key) + " " + node);
                } else {
                  parent.push([key, node]);
                }
              }
            } else if (last == 1) {
              parent.set(key, value);
              stack = [];
              return;
            } else {// error
            }
          } else {
            if (parent) {
              parent.push([null, node]);
            }
          }
        }
      }

      stack = [];
      let depth = parent ? parent.depth + 1 : type == 9 || type == 11 ? 0 : 1;
      let vnode = new _vnode.VNode(cx, node, type, name, key, (0, _type.isLeaf)(type) ? node.valueOf() : null, parent, depth, parent ? parent.count() : 0); //let vnode = cx.vnode(node,parent,depth,parent ? parent.count() : 0,type);

      if (_isBranch) {
        parents.push(vnode);
      } //console.log("buf",node.name);


      buf.add(vnode);
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
        } // flush all


        buf.flush($o);
        $o.complete();
      }
    });
  });
};

exports.toVNodeStreamCurried = toVNodeStreamCurried;

function fromVNodeStream($node) {
  // I know I know, not functional...
  return _rxjs.Observable.create($o => {
    $node.subscribe({
      next(vnode) {
        const type = vnode.type;
        if (type == 9 || type == 11) return;

        if (vnode.key !== undefined) {
          $o.next(2);
          $o.next(vnode.key);
        } // NOTE doctype type needs to be serialized as 16, but we handle it in serialization


        $o.next(type); //console.log(type,vnode.name);

        if ((0, _type.hasName)(type)) {
          $o.next(vnode.name);
        } else if ((0, _type.isLeaf)(type)) {
          $o.next(vnode.value + "");
        } // emit all pairs
        // TODO provide option to traverse attributes...


        if (type == 1) {
          for (let [k, v] of vnode.entries()) {
            $o.next(2);
            $o.next(k);
            $o.next(3);
            $o.next(v);
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
//# sourceMappingURL=convert.js.map