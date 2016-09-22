import FastIntCompression from "fastintcompression";
import { Node } from "xvnode";

export function serialize($node){
    var node = $node;//Node.isSeq($node) ? $node.first() : $node;
    var nil = Buffer.alloc(1),
        out = new Buffer(0),
        namebuf = new Buffer(0),
        valbuf = new Buffer(0),
        names = {},
        values = {},
        ncount = 0,
        vcount = 0,
        cur = node,
        depth = 0,
        index = 0,
        l = cur.count(),
        type,
        offsets;
    var getName = function(cur){
        var name = cur.name();
        if (!names[name]) {
            ncount++;
            names[name] = ncount;
            namebuf = Buffer.concat([namebuf, Buffer.from(FastIntCompression.compress(str2array(name))), nil]);
        }
        return ncount;
    };
    var getValue = function(cur){
        var val = cur.value();
        if (!values[val]) {
            vcount++;
            values[val] = vcount;
            valbuf = Buffer.concat([valbuf, Buffer.from(FastIntCompression.compress(str2array(val))), nil]);
        }
        return vcount;
    };

    while (cur) {
        type = cur._type;
        //console.log("with", cur._name, index, l);
        // do we have more children?
         if (type == 1 && index < l) {
            var nxt = cur.get(index);
            // special case where only 1 child and it is text
            if(type == 1 && l == 1 && nxt._type==3){
                out = Buffer.concat([out, Buffer.from(FastIntCompression.compress([depth + 1, type, getName(cur), getValue(nxt)])), nil]);
                depth--;
                cur = cur._parent;
                if (cur) {
                    index = cur._index + 1;
                    l = cur.count();
                }
                continue;
            }
            depth++;
            cur._index = index;
            cur = nxt;
            index = 0;
            l = cur.count();
            //console.log("down", cur._name);
        } else {
            // write head
            //console.log("write", type == 1 ? cur._name : cur.first());
            if (type == 1) {
                out = Buffer.concat([out, Buffer.from(FastIntCompression.compress([depth + 1, type, getName(cur)])), nil]);
            } else if(type == 2 || type == 7){
                out = Buffer.concat([out, Buffer.from(FastIntCompression.compress([depth + 1, type, getName(cur), getValue(cur)])), nil]);
            } else {
                out = Buffer.concat([out, Buffer.from(FastIntCompression.compress([depth + 1, type, getValue(cur)])), nil]);
            }
            // go back up
            depth--;
            //console.log("up", cur._name, type, cur._parent ? cur._parent._name : "no parent");
            cur = cur._parent;
            if (cur) {
                index = cur._index + 1;
                l = cur.count();
            }
        }
    }
    // repair difference with offset itself in uncompress
    offsets = Buffer.from(FastIntCompression.compress([namebuf.length,valbuf.length]));
    return Buffer.concat([offsets, nil, namebuf, valbuf, out]);
}

export function parse(buf) {
    // TODO read stream chunked
    var cur = 0,
        offsets,
        nameoffset,
        valoffset,
        names = [],
        values = [],
        stack = [],
        nn,
        node,
        name,
        value,
        depth,
        type;
    for (var i = 0; i < buf.length; i++) {
        if (buf[i] === 0) {
            if (!offsets) {
                offsets = FastIntCompression.uncompress(buf.slice(cur, i));
                nameoffset = i+offsets[0]+1;
                valoffset = i+nameoffset+offsets[1]+1;
            } else if (i < nameoffset) {
                names.push(buf.slice(cur, i).toString());
            } else if (i < valoffset) {
                values.push(buf.slice(cur, i).toString());
            } else {
                //nodes.push();
                nn = FastIntCompression.uncompress(buf.slice(cur, i));
                depth = nn[0];
                type = nn[1];
                //var l = nn.length;
                if(!stack[depth]) stack[depth] = [];
                name = type < 3 || type == 7 ? names[nn[2]-1] : null;
                if(type==1 && nn.length>3){
                    stack[depth+1] = [new Node(3, null, null, values[nn[3]-1])];
                }
                value = type > 1 ? values[nn[type == 2 || type == 7 ? 3 : 2]-1] : stack[depth+1] ? stack[depth+1] : [];
                node = new Node(type, name, null, value);
                if(type == 1) stack[depth+1] = [];
                stack[depth].push(node);
            }
            cur = i+1;
        }
    }
    return node;
}

function str2array(str){
    var ar = [];
    for (var i=0, strLen=str.length; i<strLen; i++) {
      ar[i] = str.codePointAt(i);
    }
    return ar;
}

function ab2str(buf) {
  return String.fromCodePoint.apply(null, new Uint8Array(buf));
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length); // 2 bytes for each char
  var bufView = new Uint8Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.codePointAt(i);
  }
  return buf;
}

export function compress($node) {
    var doc = materialize($node);
    var nodes = doc.slice(2),
        names = doc[0],
        values = doc[1];
    var nil = Buffer.alloc(1);
    var out = new Buffer(0),
        i = 0,
        l = 0,
        offsets = [];
    for (i = 0, l = names.length; i < l; i++) {
        out = Buffer.concat([out, Buffer.from(names[i]), nil]);
    }
    //console.log(out.length,names.length);
    offsets.push(out.length);
    for (i = 0, l = values.length; i < l; i++) {
        out = Buffer.concat([out, Buffer.from(values[i]), nil]);
    }
    // repair difference with offset itself in uncompress
    offsets.push(out.length);

    for (i = 0, l = nodes.length; i < l; i++) {
        out = Buffer.concat([out, Buffer.from(FastIntCompression.compress(nodes[i])), nil]);
    }
    return Buffer.concat([Buffer.from(FastIntCompression.compress(offsets)), nil, out]);
}

export function uncompress(buf) {
    // TODO read stream chunked
    var cur = 0,
        offsets,
        nameoffset,
        valoffset,
        names = [],
        values = [],
        nodes = [];
    for (var i = 0; i < buf.length; i++) {
        if (buf[i] === 0) {
            if (!offsets) {
                offsets = FastIntCompression.uncompress(buf.slice(cur, i));
                nameoffset = i+offsets[0]+1;
                valoffset = i+nameoffset+offsets[1]+1;
            } else if (i < nameoffset) {
                names.push(buf.slice(cur, i).toString());
            } else if (i < valoffset) {
                values.push(buf.slice(cur, i).toString());
            } else {
                nodes.push(FastIntCompression.uncompress(buf.slice(cur, i)));
            }
            cur = i+1;
        }
    }
    return dematerialize([names, values].concat(nodes));
}


export function dematerialize(doc) {
    var stack = [];
    var names = doc[0],
        values = doc[1],
        nodes = doc.slice(2);
    var nn,
        node,
        name,
        value,
        depth,
        type;
    for (var i = 0; i < nodes.length; i++) {
        nn = nodes[i];
        depth = nn[0];
        type = nn[1];
        //var l = nn.length;
        if(!stack[depth]) stack[depth] = [];
        name = type < 3 || type == 7 ? names[nn[2]-1] : null;
        if(type==1 && nn.length>3){
            stack[depth+1] = [new Node(3, null, null, values[nn[3]-1])];
        }
        value = type > 1 ? values[nn[type == 2 || type == 7 ? 3 : 2]-1] : stack[depth+1] ? stack[depth+1] : [];
        node = new Node(type, name, null, value);
        if(type == 1) stack[depth+1] = [];
        stack[depth].push(node);
    }
    return node;
}

export function materialize(node) {
    var names = {},
        values = {};
    var ncount = 0,
        vcount = 0;
    var cur = node;
    var ret = [],
        depth = 0,
        index = 0,
        l = cur.count(),
        type;
    var getName = function(cur){
        var name = cur.name();
        if (!names[name]) {
            ncount++;
            names[name] = ncount;
        }
        return ncount;
    };
    var getValue = function(cur){
        var val = cur.value();
        if (!values[val]) {
            vcount++;
            values[val] = vcount;
        }
        return vcount;
    };

    while (cur) {
        type = cur._type;
        //console.log("with", cur._name, index, l);
        // do we have more children?
         if (type == 1 && index < l) {
            var nxt = cur.get(index);
            // special case where only 1 child and it is text
            if(type == 1 && l == 1 && nxt._type==3){
                ret.push([depth+1, type, getName(cur), getValue(nxt)]);
                depth--;
                cur = cur._parent;
                if (cur) {
                    index = cur._index + 1;
                    l = cur.count();
                }
                continue;
            }
            depth++;
            cur._index = index;
            cur = nxt;
            index = 0;
            l = cur.count();
            //console.log("down", cur._name);
        } else {
            // write head
            //console.log("write", type == 1 ? cur._name : cur.first());
            if (type == 1) {
                ret.push([depth + 1, type, getName(cur)]);
            } else if(type == 2 || type == 7){
                ret.push([depth + 1, type, getName(cur), getValue(cur)]);
            } else {
                ret.push([depth + 1, type, getValue(cur)]);
            }
            // go back up
            depth--;
            //console.log("up", cur._name, type, cur._parent ? cur._parent._name : "no parent");
            cur = cur._parent;
            if (cur) {
                index = cur._index + 1;
                l = cur.count();
            }
        }
    }
    var namea = [],
        vala = [];
    for (var k in names) {
        namea[names[k]-1] = k;
    }
    for (k in values) {
        vala[values[k]-1] = k;
    }
    return [namea, vala].concat(ret);
}
