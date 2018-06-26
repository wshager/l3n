class MultiMap {
	constructor() {
		this._buckets = {};
		this._size = 0;
		this.__is_MultiMap = true;
	}
	push(entry) {
		var key = entry[0];
		var bucket = this._buckets[key];
		entry[2] = this._size++;
		if (bucket && bucket.__is_Bucket) {
			bucket.push(entry);
		} else {
			this._buckets[key] = new Bucket(entry);
		}
		return this;
	}
	get(key) {
		var bucket = this._buckets[key];
		if (bucket && bucket.__is_Bucket) {
			let vals = bucket._values,
				len = vals.length;
			if (len === 0) return;
			if (len == 1) return vals[0][1];
			// TODO fix order if needed
			const out = new Array(len);
			for (var i = 0; i < len; i++) {
				out[i] = vals[i][1];
			}
			return out;
		}
	}
	keys() {
		// retain key types
		var keys = [];
		for (var i = 0, l = this._buckets.length; i < l; i++) {
			keys[i] = this._buckets[i][0];
		}
		return keys;
	}
}

class Bucket {
	constructor(val) {
		this._values = [val];
		this.__is_Bucket = true;
	}
	push(val) {
		this._values.push(val);
		return this;
	}
}

const multimap = () => new MultiMap();

export default multimap;
