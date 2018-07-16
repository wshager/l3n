"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
exports.modify = modify;
exports.stringify = stringify;
exports.getType = exports.__vnode_context = void 0;

var _vnode = require("./vnode");

var _type = require("./type");

var _doctype = require("./doctype");

var _arrayUtil = require("./array-util");

var cx = _interopRequireWildcard(require("./dom"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// import self!
// helpers ---------------
const wsre = /^[\t\n\r ]*$/;

const ignoreWS = x => x.nodeType != 3 || !wsre.test(x.textContent);

const filterWS = (0, _arrayUtil.filter)(ignoreWS);
const l3re = /^l3-(e?)(a?)(x?)(r?)(l?)(m?)(p?)(c?)()()(d?)()()(f?)(q?)$/;

const getL3Type = name => {
  const matches = l3re.exec(name.toLowerCase());
  if (!matches) return 0;

  for (let i = 1, l = matches.length; i < l; i++) {
    if (matches[i]) return i;
  }

  return 0;
};

const constructors = {
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

var getQName = function getQName(node, indexInParent) {
  var nodeType = node.nodeType;
  var nodeName = node.nodeName;

  if (nodeType == 1) {
    var l3Type = getL3Type(nodeName); //let type = l3Type | nodeType;

    var isL3 = l3Type !== 0;
    var attrs = node.attributes;
    return isL3 ? attrs.name : nodeName;
  } else {
    return indexInParent + 1;
  }
}; //import { qname } from "./qname";
// -----------------------
// Core API
// -----------------------


const __vnode_context = "dom";
exports.__vnode_context = __vnode_context;

function vnode(node, parent, depth, indexInParent) {
  var nodeType = node.nodeType;
  var nodeName = node.nodeName;
  let isElem = nodeType == 1;
  var l3Type = isElem ? getL3Type(nodeName) : 0;
  let type = l3Type || nodeType;
  var isL3 = isElem && l3Type !== 0;
  var attrs = isElem ? node.attributes : null;
  var name, key, value;

  if (type == 1 || type == 14) {
    // if l3, nodeType != type
    name = isL3 ? attrs.name : nodeName;
  } else if (type == 2) {
    // no-op?
    key = node.name;
  } else if (type == 5) {// no-op?
  } else if (type == 6) {// no-op?
  } else if (type == 3 || type == 8 || type == 12) {
    value = isL3 ? node.textContent : node.data;
  } // return vnode


  return new _vnode.VNode(cx, node, type, name, key, value, parent, depth, indexInParent);
} // TODO relative document?


function create(type, nameOrValue) {
  if (type == 9) {
    return document.implementation.createDocument(null, null);
  } else if (type == 10) {
    return document.implementation.createDocumentType(...nameOrValue);
  } else if (type == 11) {
    return document.createDocumentFragment();
  } else if ((0, _type.isBranch)(type)) {
    const name = type == 1 ? nameOrValue : "l3-" + constructors[type];
    var elem = document.createElement(name);
    if (type == 14) elem.name = nameOrValue;
    return elem;
  } else if (type == 2) {
    return document.createAttribute(nameOrValue);
  } else if (type == 3) {
    return document.createTextNode(nameOrValue);
  } else if (type == 4) {
    // provisional link type ;)
    const node = document.createElement("link");
    node.setAttribute("rel", "import");
    node.setAttribute("href", nameOrValue);
    return node;
  } else if (type == 7) {
    return document.createProcessingInstruction(...nameOrValue);
  } else if (type == 8) {
    return document.createComment(nameOrValue);
  }
}

function get(node, idx, type) {
  type = type || getType(node);

  if ((0, _type.isBranch)(type)) {
    return filterWS(node.childNodes)[idx];
  }

  return node[idx];
}

function has(node, idx, type) {
  return !!get(node, idx, type);
}

function next(node, vnode, type) {
  type = type || getType(node);

  if ((0, _type.isBranch)(type)) {
    // ignore WS-only!
    var nxt = vnode.nextSibling;

    while (nxt && !ignoreWS(nxt)) {
      nxt = vnode.nextSibling;
    }

    return nxt || undefined;
  }
}

function previous(node, vnode, type) {
  type = type || getType(node);

  if ((0, _type.isBranch)(type)) {
    // ignore WS-only!
    var prv = vnode.previousSibling;

    while (prv && !ignoreWS(prv)) {
      prv = vnode.previousSibling;
    }

    return prv || undefined;
  }
}

function push(node, kv, type) {
  type = type || getType(node);

  if ((0, _type.isBranch)(type)) {
    node.appendChild(kv[1]);
  }

  return node;
}

function set(node, key, val, type) {
  type = type || getType(node);

  if (type == 1) {
    node.setAttribute(key, val);
  } else if (type == 6) {
    const attr = document.createElement("l3-a");
    attr.setAttribute("name", key);
    attr.appendChild(val);
    node.appendChild(attr);
  }

  return node;
}

function removeChild(node, vchild, type) {
  if ((0, _type.isBranch)(type)) {
    node.removeChild(vchild.node);
  }

  return node;
}

function cached() {}

function keys(node, type) {
  if (type == 1 || type == 9 || type == 11 || type == 14 || type == 15) {
    let children = filterWS(node.childNodes),
        len = children.length,
        keys = [];

    for (let i = 0; i < len; i++) {
      keys[i] = getQName(children[i], i);
    }

    return keys;
  } // TODO l3


  if (type == 5) return (0, _arrayUtil.range)(filterWS(node.childNodes).length).toArray();
  if (type == 6) return (0, _arrayUtil.map)(c => c.getAttribute("name"))(filterWS(node.childNodes));
  return [];
}

function values(node, type) {
  if (type == 1 || type == 9 || type == 11) return filterWS(node.childNodes); //if (type == 2) return [[node.$name,node.$value]];
  //if(type == 6) return Object.values(node);
  //if (type == 8) return [node.$comment];

  return node;
}

function finalize(node) {
  return node;
}

function count(node, type) {
  type = type || getType(node);

  if ((0, _type.isBranch)(type)) {
    return filterWS(node.childNodes).length;
  } // TODO l3


  return 0;
}

function first(node, type) {
  type = type || getType(node);

  if (type == 1 || type == 9 || type == 11) {
    return filterWS(node.childNodes)[0];
  }
}

function last(node, type) {
  type = type || getType(node);
  if (type == 1 || type == 9 || type == 11) return filterWS(node.childNodes).lastItem;
}

function entries(node, type) {
  type = type || getType(node);

  if (type == 1) {
    var i = [];

    try {
      for (var a of node.attributes) {
        i[a.name] = a.value;
      }
    } catch (err) {// whatever
    }

    return i;
  }

  return [];
}

function modify(node, vnode, ref, type) {
  type = type || getType(node);

  if (type == 2) {
    // insert faux data
    node.$value = vnode.node;
  } else if (type == 6) {
    const attr = document.createElement("l3-a");
    attr.setAttribute("name", vnode.key);
    attr.appendChild(vnode.node.$value);
    node.appendChild(attr);
  } else if ((0, _type.isBranch)(type)) {
    if (vnode.type == 2) {
      // TODO conversion rules!
      const attr = vnode.node;
      attr.value = attr.$value.textContent;
      node.setAttributeNode(attr);
    } else if (ref !== undefined) {
      node.insertBefore(vnode.node, ref.node);
    } else {
      node.appendChild(vnode.node);
    }
  }

  return node;
}

function stringify(node, type) {
  type = type || getType(node);

  if (type == 9 || type == 11) {
    return (0, _arrayUtil.map)(c => stringify(c))(node.childNodes).join("");
  } else if ((0, _type.isBranch)(type)) {
    return node.outerHTML;
  } else if (type == 10) {
    return `<!DOCTYPE ${(0, _doctype.serialize)(node.name, node.publicId, node.systemId)}>`;
  } else {
    const text = node.textContent;
    if (type == 7) return `<?${text}?>`;
    if (type == 8) return `<!--${text}-->`;
    if (type == 12) return `<l3-x>${text}</l3-x>`;
    return text;
  }
}

const getType = node => {
  var nodeType = node.nodeType;
  var nodeName = node.nodeName;
  let isElem = nodeType == 1;
  return isElem ? getL3Type(nodeName) || 1 : nodeType;
};

exports.getType = getType;
//# sourceMappingURL=dom.js.map