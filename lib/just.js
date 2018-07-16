"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rxjs = require("rxjs");

const just = o => (0, _rxjs.isObservable)(o) ? o : (0, _rxjs.of)(o);

var _default = just;
exports.default = _default;
//# sourceMappingURL=just.js.map