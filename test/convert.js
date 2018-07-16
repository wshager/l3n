const rx = require("rxjs");
const l3 = require("../lib/index");
l3.toVNodeStream(rx.of(1,"div",2,"id",3,"bla",1,"p",3,"some bla bla",17,17)).pipe(x => l3.fromVNodeStream(x)).subscribe(vnode => console.log(vnode + ""));
