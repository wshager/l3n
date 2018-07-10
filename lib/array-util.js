"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const range = exports.range = n => [...Array(n).keys()];

const filter = exports.filter = (...a) => l => Array.prototype.filter.apply(l, a);

const map = exports.map = (...a) => l => Array.prototype.map.apply(l, a);

const append = exports.append = (l, v) => (l.push(v), l);
//# sourceMappingURL=array-util.js.map