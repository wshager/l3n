var fs = require("fs");
var xvtree = require("xvtree");
var l3n = require("../lib/l3n");
//var benchmark = require("benchmark");
var xmlstr = fs.readFileSync("d:/Order.xml",'utf-8',function(err,doc){
    if(err) throw new Error(err);
});
xvtree.default(xmlstr,function(err,doc){
	console.log(l3n.parse(l3n.serialize(doc)));
});
