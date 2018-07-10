export const range = n => [...Array(n).keys()];

export const filter = (...a) => l => Array.prototype.filter.apply(l,a);

export const map =  (...a) => l => Array.prototype.map.apply(l,a);

export const append = (l,v) => (l.push(v),l);
