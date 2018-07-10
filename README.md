# L3N: Flat Trees!

Construct and traverse trees with a coherent set of functions.

L3 trees can express HTML, XML, JSON or functional programs.


## The Concept

Many documents can be iterated as a flat sequence of nodes, be it an XML or HTML document, a piece of JSON or even a functional program (see [Raddle](https://npmjs.com/raddle)). The way documents are traversed is in *document order*, just like a SAX parser: an event is emitted for when a branch opens or closes, or when a (text) leaf is completed.

This library stores all familiar document nodes as plain JSON by using a simple convention. Traversal of documents is exposed as an Observable stream (uses RxJS 6). This ensures that there's no difference between traversing an in-memory tree or connecting to a SAX-style parser: everything is a stream.

Each node that is emitted on the stream is wrapped in a transient container that provides a reference to the parent node (see the `VNode` class). In addition, the `VNode` interface exposes more relevant properties, such as its depth relative to the root or its position relative to its parent. These enable traversal across all DOM axes. Furthermore, node names and values may be indexed to increase performance.

This library provides an immutable alternative to plain JSON (via the `pnode` context) and a native DOM context for the browser. The traversal context may be switched by simply binding each accessor function to another context module.

For native DOM traversal in the browser, the `VNode` integrates with the canonical TreeWalker API (uses ES6 WeakMap).

Note: you should not create references to VNode instances, or they can't be garbage collected. Transform them functionally instead, by using RxJS or a specialized library (see [Frink](https://npmjs.com/frink)).


## Install / setup

`npm i l3n`

The easiest way to get started is with the Node.js distribution:

```javascript
const l3 = require("l3n");

// Direct construction of a document-fragment, no Rx:

const frag = l3.t(
  l3.e("div",
    l3.a("class","greeting"),
    l3.e("p","Hello")
  )
)

console.log(frag.toString());

console.log(frag.toJS());
```

```javascript
// Alternatively, you can pass a 'document implementation context' to the faux VNode directly.
// Below example will create a persistent tree
const div = l3.e("div",
  l3.a("class","greeting"),
  l3.e("p","Hello")
).node(l3.pnode);

console.log(div.toString());

console.log(div.toJS());
```


## API documentation (WIP)

Documentation index: [index](./docs/index.md)


## Examples (ES modules)

```javascript
import { e, m, a, ensureDoc } from "l3n";

const div = e("div",
  a("class","greeting"),
  e("p","Hello")
);

const map = m(
  a("greeting","Hello")
);
```

### HTML serialization

```javascript
ensureDoc(div).subscribe(vnode => {
    console.log(vnode.toString());
});
```

yields

```html
<div class="greeting"><p>Hello</p></div>
```

while

```javascript
ensureDoc(map).subscribe(vnode => {
    console.log(vnode.toString());
});
```

yields

```html
<l3-m><l3-a name="greeting">Hello</l3-a></l3-m>
```


### JS/JSON

```javascript
ensureDoc(div).subscribe(vnode => {
    console.log(vnode.toJS());
});
```

yields

```json
{
  "$name":"div",
  "class":"greeting",
  "$children":[{
    "$name":"p",
    "$children":["Hello"]
  }]
}
```

while

```javascript
ensureDoc(map).subscribe(vnode => {
    console.log(vnode.toJS());
});
```

yields

```json
{
  "greeting":"Hello"
}
```


## Serialization rules

L3N serialization rules for JSON:

| Constant | VNode Type                | Appearance  |
| -------- | ------------------------- | ----------- |
| 1 | Element | `{"$name":"qname","some-attr":"some-value","$children":[]}` |
| 3 | teXt | `"some-text"` |
| 4 | Reference | `{"$ref":"/some/path"}` |
| 5 | List | `[]` |
| 6 | Map | `{}` |
| 7 | Processing instruction | `{"$pi"":"xml-stylesheet "\"type\"=\"text/xsl\" \"href\"=\"some.xsl\""}` |
| 8 | Comment | `{"$comment":"some-comment"}`|
| 12 | teXt | `123`, `true` or `null` |
| 10 | doctype | `{"$doctype":"serialized-doctype"}` |
| 14 | Function call | `{"$name":"some-function","$args":[]}` |
| 15 | Quotation (AKA lambda) | `{"$args":[]}`
____

L3N serialization rules for XML:

| Constant | VNode Type                | Appearance  |
| -------- | ------------------------- | ----------- |
| 1 | Element | `<some-element some-attr="some-value"></some-element>` |
| 3 | teXt | `some-text` |
| 4 | Reference | `<include xmlns="http://www.w3.org/2001/XInclude" href="/some/path" parse="xml"/>` |
| 5 | List | `<l3:l xmlns:l3="http://l3n.org"></l3:l>` |
| 6 | Map | `<l3:m xmlns:l3="http://l3n.org"><l3:a name="my-xml-tuple"><some-element /></l3:a></l3:m>` |
| 7 | Processing instruction | `<?xml-stylesheet type="text/xsl" href="some.xsl" ?>` |
| 8 | Comment | `<!-- some-comment -->`|
| 10 | doctype | <!DOCTYPE ...> |
| 12 | teXt | `<l3:x xmlns:l3="http://l3n.org">123</l3:x>` |
| 14 | Function call | `<l3:f xmlns:l3="http://l3n.org" name="some-function"></l3:f>` |
| 15 | Quotation | `<l3:q xmlns:l3="http://l3n.org"></l3:q>`
____

L3N serialization rules for HTML:

| Constant | VNode Type                | Appearance  |
| -------- | ------------------------- | ----------- |
| 1 | Element | `<some-element some-attr="some-value"></some-element>` |
| 2 | Key-value pair | v
| 3 | teXt | `some-text` |
| 4 | Reference | `<link rel="import" href="/some/path">` |
| 5 | List | `<l3-l></l3-l>` |
| 6 | Map | `<l3-m><l3-a name="key">value</l3-a></l3-m>` |
| 7 | Processing instruction | N/A |
| 8 | Comment | `<!-- some-comment -->`|
| 10 | doctype | <!DOCTYPE ...> |
| 12 | teXt | `<l3-x>123</l3-x>` |
| 14 | Function call | `<l3-f name="some-function"></l3-f>` |
| 15 | Quotation | `<l3-q></l3-q>`
