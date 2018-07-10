const l3 = require("../lib/index");

// direct construction of a document-fragment, no Rx:

const frag =
	l3.e("div",
		l3.a("class","greeting"),
		l3.e("p","Hello")
	).node(l3.inode);

console.log(frag.toString());

console.log(frag.toJS());
