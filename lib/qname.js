"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.isQName = isQName;
function isQName(maybe) {
	return !!(maybe && maybe.__is_QName);
}

class QName {
	constructor(uri, name) {
		var prefix = /:/.test(name) ? name.replace(/:.+$/, "") : null;
		this.name = name;
		this.prefix = prefix;
		this.uri = uri;
		this.__is_QName = true;
	}
}
exports.QName = QName;