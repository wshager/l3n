"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rxjs = require("rxjs");

const just = o => (0, _rxjs.isObservable)(o) ? o : (0, _rxjs.of)(o);

exports.default = just;
//# sourceMappingURL=just.js.map