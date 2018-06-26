"use strict";

// convenience methods ES6+
const objUtil = function objUtil(obj, f) {
	var keys = Object.keys(obj);
	var entries = [];
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		entries.push(f(key));
	}
	return entries;
};

if (!Object.values) {
	Object.values = function (o) {
		return objUtil(o, function (key) {
			return o[key];
		});
	};
}
if (!Object.entries) {
	Object.entries = function (o) {
		return objUtil(o, function (key) {
			return [key, o[key]];
		});
	};
}
if (!Array.prototype.last) {
	Array.prototype.last = function () {
		return this[this.length - 1];
	};
}