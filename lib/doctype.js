"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serialize = serialize;
exports.deserialize = deserialize;

function serialize(qname, publicId, systemId) {
  return qname + (publicId ? " PUBLIC \"" + publicId + "\"" : "") + (!publicId && systemId ? " SYSTEM" : "") + (systemId ? " \"" + systemId + "\"" : "");
} // adapted from https://github.com/jindw/xmldom


function _split(source) {
  var buf = [];
  var reg = /'[^']+'|"[^"]+"|[^\s/=]+=?/g;
  reg.lastIndex = 0;
  var match = reg.exec(source);

  while (match) {
    buf.push(match);
    match = reg.exec(source);
  }

  return buf;
}

function deserialize(str) {
  const parts = _split(str.replace(/\s+/g, " ").trim());

  const len = parts.length;
  if (len == 1) return [parts[0][0], "", ""];
  const type = parts[1][0];

  if (type == "PUBLIC") {
    return [parts[0][0], parts[2][0], parts[3][0]];
  }

  if (type == "SYSTEM") {
    return [parts[0][0], "", parts[2][0]];
  }
}
//# sourceMappingURL=doctype.js.map