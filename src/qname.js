export function isQName(maybe) {
	return !!(maybe && maybe.__is_QName);
}

export class QName {
	constructor(uri, name) {
		var prefix = /:/.test(name) ? name.replace(/:.+$/, "") : null;
		this.name = name;
		this.prefix = prefix;
		this.uri = uri;
		this.__is_QName = true;
	}
}
