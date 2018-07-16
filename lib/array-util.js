"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.append = exports.map = exports.filter = exports.range = void 0;

const range = n => [...Array(n).keys()];

exports.range = range;

const filter = (...a) => l => Array.prototype.filter.apply(l, a);

exports.filter = filter;

const map = (...a) => l => Array.prototype.map.apply(l, a);

exports.map = map;

const append = (l, v) => (l.push(v), l);

exports.append = append;
//# sourceMappingURL=array-util.js.map