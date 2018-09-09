"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isString = exports.isUndef = void 0;

const isUndef = value => value === undefined;

exports.isUndef = isUndef;

const isString = value => typeof value == "string"; // && isNaN(value);


exports.isString = isString;
//# sourceMappingURL=util.js.map