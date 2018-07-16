const l3 = require("../lib/index");

const time = hrtime => {
	const nanoseconds = (hrtime[0] * 1e9) + hrtime[1];
	const milliseconds = nanoseconds / 1e6;
	const seconds = nanoseconds / 1e9;

	return {
		seconds,
		milliseconds,
		nanoseconds
	};
};
// direct construction of a document-fragment, no Rx:
const frag =
	l3.e("div",
		l3.a("class","greeting"),
		l3.e("p",l3.e("p",l3.e("p",l3.e("p",l3.e("p",l3.e("p",l3.e("p",l3.e("p",l3.e("p",l3.e("p",l3.e("p",l3.e("p",l3.x("Hello")))))))))))))
	).node(l3.inode);

const s = process.hrtime();
l3.traverse.bind(l3.inode)(frag).subscribe({
	complete() {
		console.log(time(process.hrtime(s)));
	}
});
