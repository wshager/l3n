"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getType = getType;
exports.set = set;
exports.vnode = vnode;
exports.create = create;
exports.get = get;
exports.has = has;
exports.next = next;
exports.push = push;
exports.removeChild = removeChild;
exports.cached = cached;
exports.keys = keys;
exports.values = values;
exports.finalize = finalize;
exports.count = count;
exports.first = first;
exports.last = last;
exports.entries = entries;
exports.modify = modify;
exports.stringify = stringify;
exports.toJS = toJS;
exports.__vnode_context = void 0;

var ohamt = _interopRequireWildcard(require("ohamt"));

var rrb = _interopRequireWildcard(require("rrb-vector"));

var _vnode = require("./vnode");

var _type = require("./type");

var _doctype = require("./doctype");

var cx = _interopRequireWildcard(require("./pnode"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

//import { prettyXML } from "./pretty";
// import self!
// helpers ---------------
const __vnode_context = "pnode";
/**
 * immutable value wrapper
 * this differs much from inode, because we would infer a type there,
 * but here we have a typed value or name/value pair
 * @param       {[type]} type  [description]
 * @param       {[type]} name  [description]
 * @param       {[type]} value [description]
 * @constructor
 */

exports.__vnode_context = __vnode_context;

class Value {
  constructor(type, name, value) {
    this.$type = type;
    this.$name = name;
    this.$value = value;
    this.__is_Value = true;
    this.size = 0;
  }

  get() {
    return this.$value;
  } // immutable, so type can't change


  set(value) {
    return new Value(this.$type, this.$name, value);
  }

  values() {
    // attr vs typed string vs primitive?
    return [this.$value];
  }

  count() {
    return this.size;
  }

  valueOf() {
    return this.$value;
  }

  toString() {
    var str = this.$value + ""; //if(this.$type == 3 && json) return "\""+str+"\"";

    return str;
  }

  toJS() {
    return this.valueOf();
  }

}

function getType(node) {
  return node.$type;
} // -----------------------


function set(node, key, value
/*, type*/
) {
  //type = type || getType(node);
  return node.set(key, value);
}

function vnode(node, parent, depth, indexInParent, type) {
  type = type || getType(node);
  let name,
      key = node.$key,
      value;

  if (type == 1 || type == 9 || type == 11 || type == 14) {
    name = node.get("$name");
  } else if (type == 2) {
    name = node.$name;
    value = node.$value; // this ensures pairs are iterated as values (name != key)

    if (node.$key) {
      node = node.$value;
      type = getType(node);
    }
  } else if (type == 7) {
    value = node.$value;
  } else if (type == 8) {
    value = node.$value;
  } else if (type == 3 || type == 12) {
    value = node;
  } else if (type == 15) {
    name = "quote";
  }

  return new _vnode.VNode(cx, node, type, name, key, value, parent, depth, indexInParent);
}

function create(type, nameOrValue, attrs = {}) {
  if (type == 5) {
    const node = rrb.empty.beginMutation();
    node.$type = type;
    return node;
  } else if ((0, _type.isBranch)(type)) {
    const node = Object.entries(attrs).reduce((a, [k, v]) => a.set(k, v), ohamt.make().beginMutation());
    node.$type = type;

    if (type == 6) {
      return node;
    } else if (type == 1 || type == 9 || type == 11) {
      return node.set("$name", nameOrValue).set("$children", rrb.empty.beginMutation());
    } else if (type == 14) {
      return node.set("$name", nameOrValue).set("$args", rrb.empty.beginMutation());
    } else if (type == 15) {
      return node.set("$args", rrb.empty.beginMutation());
    }
  } else if (type == 2) {
    return new Value(2, nameOrValue);
  } else {
    const val = type == 7 ? nameOrValue.join(" ") : type == 10 ? (0, _doctype.serialize)(...nameOrValue) : nameOrValue;
    return new Value(type, null, val);
  }
}

function get(node, idx) {
  return node.get(idx);
}

function has(node, idx) {
  return node.has(idx);
}

function next(node, vnode
/*,type*/
) {
  //type = type || getType(node);
  const next = node.next(vnode.name, vnode.node);
  return next;
}

function push(node, kv, type) {
  type = type || getType(node);

  if (type == 1 || type == 9 || type == 11) {
    // children is a multimap
    return node.set("$children", node.get("$children").push(kv[1]));
  } else {
    const [k, v] = kv;

    if (type == 5) {
      return node.push(v);
    } else if (type == 6) {
      return node.set(k, v);
    } else if (type == 14 || type == 15) {
      node.set("$args", node.get("$args").push(v));
    }
  }

  return node;
}

function removeChild(node, child, type) {
  type = type || node._type;
  var key = child.name,
      val = child.node;

  if (type == 1 || type == 9 || type == 11) {
    return node.set("$children", node.get("$children").removeValue(key, val));
  } else if (type == 5 || type == 6) {
    return node.remove(key);
  }

  return node;
}

function cached() {// TODO?
}

function keys(node) {
  return node.keys();
}

function values(node) {
  return node.values();
}

function finalize(node) {
  return node.endMutation();
}

function count(node, type) {
  type = type || getType(node);
  return type == 1 || type == 9 || type == 11 ? node.get("$children").count() : node.count();
}

function first(node, type) {
  type = type || getType(node);
  const first = type == 1 || type == 9 || type == 11 ? node.get("$children").first() : node.first();
  return first;
}

function last(node) {
  return node.last();
}

function entries(node) {
  return node.entries();
}

function modify(node, vnode, ref, type) {
  type = type || getType(node);

  if (type == 1 || type == 9 || type == 11) {
    if (vnode.type == 2) {
      return node.set(vnode.name, vnode.node.$value + "");
    } else if (ref !== undefined) {
      return node.set("$children", node.get("$children").insertBefore([ref.name, ref.node], [vnode.name, vnode.node]));
    } else {
      // FIXME check the parent type
      return node.set("$children", node.get("$children").push(vnode.node));
    }
  } else if (type == 2) {
    return node.set(vnode.node);
  } else if (type == 5) {
    if (ref !== undefined) {
      return node.insertBefore(ref, vnode.node);
    } else {
      return node.push(vnode.node);
    }
  } else if (type == 6) {
    return node.set(vnode.name, vnode.node.$value);
  }

  return node;
}

const reduceList = (list, f, z) => {
  for (let i = 0, l = list.size; i < l; i++) {
    z = f(z, list.get(i), i, list);
  }

  return z;
};

const dollarRE = /^\$/;

function _elemToString(e) {
  const attrFunc = (z, v, k) => {
    if (dollarRE.test(k)) return z;
    return z += " " + k + "=\"" + v + "\"";
  };

  const name = e.get("$name");
  let str = "<" + name; // TODO QName
  //let ns = {};
  //if(ns) str += " xmlns" + (ns.prefix ? ":" + ns.prefix : "") + "=\"" + ns.uri + "\"";

  str = e.reduce(attrFunc, str);
  const children = e.get("$children");

  if (children.size) {
    str += ">";
    str = reduceList(children, (a, c) => a + stringify(c), str);
    str += "</" + name + ">";
  } else {
    str += "/>";
  }

  return str;
}

function stringify(node, type, prettifier) {
  var str = "";
  type = type || getType(node);

  const docAttrFunc = (z, v, k) => {
    if (k == "DOCTYPE") return z + "<!" + k + " " + v + ">";
    return z;
  }; //const objFunc = (kv) => "\""+kv[0]+"\":"+kv[1].toString(false,true);


  if (type == 1) {
    str += _elemToString(node);
  } else if (type == 2) {
    str += "<l3:a name=\"" + node.$name + "\">" + stringify(node.$value) + "</l3:a>";
  } else if (type == 5) {
    const val = reduceList(node, (a, c) => a + stringify(c), "");
    str += "<l3:l" + (val ? ">" + val + "</l3:l>" : "/>");
  } else if (type == 6) {
    const val = node.reduce((a, v, k) => {
      return a + stringify(new Value(2, k, v));
    }, "");
    str += "<l3:m" + (val ? ">" + val + "</l3:m>" : "/>");
  } else if (type == 14 || type == 15) {
    const val = reduceList(node.get("$args"), (a, c) => a + stringify(c), "");

    if (type == 14) {
      str += "<l3:f name=\"" + node.get("$name") + "\"" + (val ? ">" + val + "</l3:f>" : "/>");
    } else {
      str += "<l3:q" + (val ? ">" + val + "</l3:q>" : "/>");
    }
  } else if (type == 9 || type == 11) {
    str = node.reduce(docAttrFunc, str);
    str = reduceList(node.get("$children"), (a, c) => a + stringify(c), str);
  } else {
    str = node.toString();
  }

  return prettifier ? prettifier(str) : str;
}

function toJS(node) {
  return node.toJS();
}
//# sourceMappingURL=pnode.js.map