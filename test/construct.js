const l3 = require("../lib/index");
const pnode = require("../lib/pnode");
l3.t.bind(pnode)(l3.m(l3.a("bla","x"))).subscribe(x => console.log("x",x+""));
