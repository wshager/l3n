export function isQName(obj) {
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

export function qname(uri,name) {
	return new QName(uri,name);
}
