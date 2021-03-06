"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getType = getType;
exports.vnode = vnode;
exports.create = create;
exports.get = get;
exports.has = has;
exports.next = next;
exports.previous = previous;
exports.push = push;
exports.set = set;
exports.removeChild = removeChild;
exports.cached = cached;
exports.keys = keys;
exports.values = values;
exports.finalize = finalize;
exports.count = count;
exports.first = first;
exports.last = last;
exports.entries = entries;
exports.attr = attr;
exports.modify = modify;
exports.toJS = toJS;
exports.stringify = stringify;
exports.__vnode_context = void 0;

var _vnode = require("./vnode");

var _multimap = _interopRequireDefault(require("./multimap"));

var _doctype = require("./doctype");

var _type = require("./type");

var cx = _interopRequireWildcard(require("./inode"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import self!
// helpers ---------------
//import { q } from "./qname";
const reservedNameKey = "$name"; //[1,2,9,11,14]

const reservedChildrenKey = "$children"; //[1,9,11]

const reservedArgsKey = "$args"; //[14,15]

const reservedValueKeys = {
  2: "$value",
  4: "$ref",
  7: "$pi",
  8: "$comment",
  10: "$doctype"
};
const hashre = /^#/;
const dollarRE = /^\$/; // -----------------------

/**
 * Interface for modules that represent a tree structure.
 *
 * @interface Node
 */

/**
 * Mark the modules as a node construction context
 * @type {String}
 */

const __vnode_context = "inode";
/**
 * Get the type of a node as a L3 type constant ranging from 1 to 17
 * @function
 * @name Node#getType
 * @param {any}  node a 'node' according to this interface
 * @return {Number} L3 type constant
 */

exports.__vnode_context = __vnode_context;

function getType(node) {
  if (node === null) return 12;
  var cc = node.constructor;

  if (cc == Array) {
    return 5;
  } else if (cc == Object) {
    if (reservedChildrenKey in node) {
      const name = node[reservedNameKey];
      return !hashre.test(name) ? 1 : name == "#document" ? 9 : 11;
    } else if (reservedArgsKey in node) {
      return node[reservedNameKey] !== undefined ? 14 : 15;
    }

    for (let type in reservedValueKeys) {
      if (reservedValueKeys[type] in node) return type;
    }

    return 6;
  } else if (cc == Number || cc == Boolean) {
    return 12;
  }

  return 3;
}
/**
 * [vnode description]
 * @param  {any} node          [description]
 * @param  {VNode} parent        [description]
 * @param  {Number} depth         [description]
 * @param  {Number} indexInParent [description]
 * @param  {Number} type          [description]
 * @return {VNode}               [description]
 */


function vnode(node, parent, depth, indexInParent, type) {
  type = type || getType(node);
  let name, key, value;

  if (type == 2) {
    name = node[reservedNameKey];
    value = node[reservedValueKeys[2]]; // this ensures pairs are iterated as their values (if no $key use attr node for construction)

    if (node.$key) {
      key = node.$key;
      node = value;
      type = getType(node);
    }
  }

  if ((0, _type.isBranch)(type)) {
    name = node[reservedNameKey];
  } else if (type == 3 || type == 12) {
    value = node;
  } else {
    value = node[reservedValueKeys[type]];
  }

  return new _vnode.VNode(cx, node, type, name, key, value, parent, depth, indexInParent);
}

function create(type, nameOrValue) {
  if (type == 5) return [];
  if (type == 6) return {};
  if (type == 3 || type == 12) return nameOrValue;
  const node = {};
  if ((0, _type.hasName)(type)) node[reservedNameKey] = nameOrValue;

  if (type == 1 || type == 9 || type == 11) {
    node[reservedChildrenKey] = [];
  } else if (type == 14 || type == 15) {
    node[reservedArgsKey] = [];
  } else if (type == 2) {
    // value will be inserted later
    node[reservedValueKeys[2]] = void 0;
  } else {
    const val = type == 7 ? nameOrValue.join(" ") : type == 10 ? (0, _doctype.serialize)(...nameOrValue) : nameOrValue;
    node[reservedValueKeys[type]] = val;
  }

  return node;
}

function get(node, idx, type) {
  type = type || getType(node);

  if (type == 6) {
    return node[idx];
  }

  if (type == 14 || type == 15) {
    return node[reservedArgsKey][idx];
  }

  return node[reservedChildrenKey][idx];
}

function has(node, idx, type) {
  type = type || getType(node);

  if (type == 5 || type == 6) {
    return idx in node;
  }

  if (type == 14 || type == 15) {
    return idx in node[reservedArgsKey];
  }

  return idx in node[reservedChildrenKey];
}

var _nextOrPrev = function _nextOrPrev(node, idx, type, dir) {
  type = type || getType(node);

  if (type == 1 || type == 9 || type == 11) {
    return node[reservedChildrenKey][idx + dir];
  }

  if (type == 14 || type == 15) {
    return node[reservedArgsKey][idx + dir];
  }

  if (type == 5) return node[idx + dir];

  if (type == 6) {
    var entries = Object.entries(node);
    var kv = entries[idx + dir]; // pass pair-wise

    return {
      $key: kv[0],
      $value: kv[1]
    };
  }
};

function next(node, vnode, type) {
  return _nextOrPrev(node, vnode.indexInParent - 1, type, 1);
}

function previous(node, vnode, type) {
  return _nextOrPrev(node, vnode.indexInParent - 1, type, -1);
}

function push(node, [k, v], type) {
  type = type || getType(node);

  if (type == 1 || type == 9 || type == 11) {
    node[reservedChildrenKey].push(v);
  } else if (type == 14 || type == 15) {
    node[reservedArgsKey].push(v);
  } else if (type == 5) {
    node.push(v);
  } else if (type == 6) {
    node[k] = v;
  }

  return node;
}

function set(node, key, val, type) {
  type = type || getType(node);

  if (type == 1 || type == 6) {
    node[key] = val;
    return node;
  }

  return node;
}

function removeChild(node, child, type) {
  type = type || getType(node);

  if (type == 1 || type == 9 || type == 11) {
    node[reservedChildrenKey].splice(child.indexInParent, 1);
  } else if (type == 5) {
    node.splice(child.indexInParent, 1);
  } else if (type == 6) {
    delete node[child.key];
  } else if (type == 14 || type == 15) {
    node[reservedArgsKey].splice(child.indexInParent, 1);
  }

  return node;
}

function cached(node, type) {
  type = type || getType(node);

  if (type == 1 || type == 9 || type == 11) {
    let children = node[reservedChildrenKey],
        len = children.length,
        cache = (0, _multimap.default)();

    for (var i = 0; i < len; i++) {
      cache.push([children[i][reservedNameKey] || i + 1, children[i]]);
    }

    return cache;
  }

  if (type == 5) {
    return {
      keys: function keys() {
        return node.keys();
      }
    };
  }

  if (type == 6) {
    return {
      keys: function keys() {
        return Object.keys(node);
      }
    };
  }
}

function keys(node, type) {
  type = type || getType(node);

  if (type == 1 || type == 9) {
    let children = node[reservedChildrenKey],
        len = children.length,
        keys = [];

    for (var i = 0; i < len; i++) {
      keys[i] = children[i][reservedNameKey] || i + 1;
    }

    return keys;
  }

  if (type == 5) return node.keys();
  if (type == 6) return Object.keys(node);
  return [];
}

function values(node, type) {
  type = type || getType(node);
  if (type == 1 || type == 9 || type == 11) return node[reservedChildrenKey];
  if (type == 14 || type == 15) return node[reservedArgsKey];
  if (type == 2) return [[node[reservedNameKey], node[reservedValueKeys[2]]]];
  if (type == 6) // pair-wise
    return Object.entries(node).map(function (kv) {
      return {
        $key: kv[0],
        $value: kv[1]
      };
    });
  if (type == 3 || type == 12) return [node];
  return [node[reservedValueKeys[type]]];
}

function finalize(node) {
  return node;
}

function count(node, type) {
  type = type || getType(node);

  if (type == 1 || type == 9 || type == 11) {
    return node[reservedChildrenKey].length;
  } else if (type == 14 || type == 15) {
    return node[reservedArgsKey].length;
  } else if (type == 5) {
    return node.length;
  } else if (type == 6) {
    return Object.keys(node).length;
  }

  return 0;
}

function first(node, type) {
  type = type || getType(node);

  if (type == 1 || type == 9 || type == 11) {
    return node[reservedChildrenKey][0];
  } else if (type == 14 || type == 15) {
    return node[reservedArgsKey][0];
  } else if (type == 5) {
    return node[0];
  } else if (type == 6) {
    var entries = Object.entries(node);
    var kv = entries[0]; // pass pair-wise

    return {
      $key: kv[0],
      $value: kv[1]
    };
  }
}

function last(node, type) {
  type = type || getType(node);
  if (type == 1 || type == 9 || type == 11) return node[reservedChildrenKey].lastItem;
  if (type == 5) return node.lastItem;

  if (type == 6) {
    var entries = Object.entries(node);
    var kv = entries.lastItem; // pass pair-wise

    return {
      $key: kv[0],
      $value: kv[1]
    };
  }

  if (type == 14 || type == 15) return node[reservedArgsKey].lastItem;
}

function entries(node, type) {
  type = type || getType(node);
  if (type == 5) return node.entries();
  if (type == 6) return Object.entries(node);
  if (type == 1 || type == 6 || type == 9 || type == 11) return Object.entries(node).filter(([k]) => !dollarRE.test(k));
  return [];
}

function attr(node, key, val, type) {
  if (type == 1 || type == 6) {
    if (val === undefined) return node[key];
    return {
      $key: key,
      $value: val
    };
  }
}

function modify(node, vnode, ref, type) {
  type = type || getType(node);

  if (type == 1 || type == 9 || type == 11) {
    if (vnode.type == 2) {
      // TODO conversion rules!
      node[vnode.name] = vnode.node.$value + "";
    } else if (ref !== undefined) {
      node[reservedChildrenKey].splice(ref.indexInParent, 0, vnode.node);
    } else {
      node[reservedChildrenKey].push(vnode.node);
    }
  } else if (type == 14 || type == 15) {
    if (ref !== undefined) {
      node[reservedArgsKey].splice(ref.indexInParent, 0, vnode.node);
    } else {
      node[reservedArgsKey].push(vnode.node);
    }
  } else if (type == 2) {
    node[reservedValueKeys[2]] = vnode.node;
  } else if (type == 5) {
    if (ref !== undefined) {
      node.splice(ref.indexInParent, 0, vnode.node);
    } else {
      node.push(vnode.node);
    }
  } else if (type == 6) {
    node[vnode.name] = vnode.node[reservedValueKeys[2]];
  }

  return node;
}

function toJS(node, type) {
  type = type || getType(node);

  if (type == 5) {
    return node.map(x => toJS(x));
  } else if (type == 6) {
    return Object.entries(node).reduce((acc, [k, v]) => {
      acc[k] = toJS(v);
      return acc;
    }, {});
  } else {
    return node.valueOf();
  }
}

function _elemToString(e) {
  const attrFunc = (z, [k, v]) => {
    if (/^\$/.test(k)) return z;
    return z + (" " + k + "=\"" + v + "\"");
  };

  const name = e[reservedNameKey];
  var str = "<" + name;
  str = Object.entries(e).reduce(attrFunc, str);
  const children = e[reservedChildrenKey];

  if (children.length > 0) {
    str += ">";

    for (let c of children) {
      str += stringify(c);
    }

    str += "</" + name + ">";
  } else {
    str += "/>";
  }

  return str;
} // FIXME XML or HTML?
// TODO ref type


function stringify(node, type, prettifier) {
  var str = "";
  type = type || getType(node);

  if (type == 1) {
    str += _elemToString(node);
  } else if (type == 9 || type == 11) {
    str = node[reservedChildrenKey].map(c => stringify(c)).join("");
  } else if (type == 2) {
    str += "<l3:a name=\"" + node.$key + "\">" + stringify(node.$value) + "</l3:a>";
  } else if (type == 5) {
    const val = node.map(c => stringify(c)).join("");
    str += "<l3:l" + (val ? ">" + val + "</l3:l>" : "/>");
  } else if (type == 6) {
    const val = Object.entries(node).reduce(function (a, c) {
      return a + stringify({
        $key: c[0],
        $value: stringify(c[1])
      });
    }, "");
    str += "<l3:m" + (val ? ">" + val + "</l3:m>" : "/>");
  } else if (type == 14 || type == 15) {
    const val = node[reservedArgsKey].reduce((a, c) => a + stringify(c), "");

    if (type == 14) {
      str += "<l3:f name=\"" + node[reservedNameKey] + "\"" + (val ? ">" + val + "</l3:f>" : "/>");
    } else {
      str += "<l3:q" + (val ? ">" + val + "</l3:q>" : "/>");
    }
  } else {
    if (type == 7) {
      str += "<?" + node[reservedValueKeys[7]] + "?>";
    } else if (type == 8) {
      str += "<!--" + node[reservedValueKeys[8]] + "-->";
    } else if (type == 10) {
      str += "<!DOCTYPE " + node[reservedValueKeys[10]] + ">";
    } else {
      const val = node === null ? "null" : node;
      str += type == 12 ? "<l3:x>" + val + "</l3:x>" : val;
    }
  }

  return prettifier ? prettifier(str) : str;
}
//# sourceMappingURL=inode.js.map