"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.isQName = isQName;
exports.qname = qname;
function isQName(obj) {
	return !!obj && obj instanceof QName;
}

class QName {
	constructor(uri, name) {
		var prefix = /:/.test(name) ? name.replace(/:.+$/, "") : null;
		this.name = name;
		this.prefix = prefix;
		this.uri = uri;
	}
	toString() {
		// TODO check scope and add ns attr
		return (this.prefix ? this.prefix + ":" : "") + this.name;
	}
}

function qname(uri, name) {
	return new QName(uri, name);
}
//# sourceMappingURL=qname.js.map