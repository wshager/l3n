import { of } from "/node_modules/rxjs/_esm2015/index";
import { first, concatMap } from "/node_modules/rxjs/_esm2015/operators/index";
import * as l3 from "/dist/index";
//console.log(l3.d.bind(l3.dom)(l3.doctype("html"),l3.m(l3.a("bla","x"))).node.doctype);
l3.toVNodeStream.bind(l3.inode)(of(1,"test",2,"id",3,"bla",17),NaN)
	.pipe(first(),concatMap(vnode => {
		console.log("x",vnode.has(0));
		return l3.traverse.bind(l3.inode)(vnode);
	})).subscribe(vnode => console.log(vnode + ""));
