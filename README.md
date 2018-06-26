# L3N: Flat Trees!

Construct and traverse trees with a coherent set of functions.

L3 trees can express HTML, XML, JSON or functional programs.


## The Concept

Many documents can be iterated as a flat sequence of nodes, be it an XML or HTML document, a piece of JSON (see http://rapidjson.org/md_doc_sax.html) or even a functional program (e.g. XQuery, LISP or RQL). The way documents are traversed is in *document order*, just like a SAX parser: an event is emitted for when a tag opens or closes, or when a text node is completed.

This library stores all nodes as plain JSON by using a simple convention (as provided by the `inode` interface). Iteration is wrapped as Observable stream, which uses RxJS 6. This convention ensures that there's no diffence in interfacing with an in-memory tree and a parser: everything is a stream. L3 also provides an immutable alternative to plain JSON (as provided by the `persist` interface).

In the XML / HTML world you often need to interface with the DOM. That's why, instead of just emitting every node as-is, each INode is wrapped in a transient container object that provides a reference to the parent node (the `VNode` interface). This way the same interface can be used for DOM as well. In addition, the VNode wrapper provides the depth and index of the node in the document, as well as the index of the node in the parent. Some work remains to be done on caching node names and indexing node values for providing fast access across across all DOM axes. From an API perspective this means you shouldn't create references to wrapper nodes, or they can't be garbage collected. Instead, you should to transform them functionally, by using RxJS or our specialized library Frink.

In the browser, the VNode interface is placed before native DOM by a small wrapper around the TreeWalker API (uses ES6 WeakMap).


## API (WIP)

### Constructors

The shorthand for L3 constructor functions is inspired by HyperScript, which is in turn inspired by put-selector, which was inspired by JSON-query, which was inspired by XPath, which is based on XML DOM. Besides, I didn't want names like `createElement`, but you can alias these functions in your code.

#### class VNode

#### e(name, children) ⇒ <code>VNode</code>
Creates an element node, which can contain multiple nodes of any type, except `document`.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| name  | <code>string, QName</code> | The name of the element |
| children | <code>aray<VNode>|ArraySeq<VNode>|Observable<VNode></code> | The children of the element |

#### a(name,value) ⇒ <code>VNode</code>
Creates an attribute node under an element, or a tuple under a map. Can contain a single node of any other type, except `document` and `attribute`. Note that when serializing to XML, attribute values are converted to a string following serializer parameters.

When the parent is not an element or map, an error will be produced.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| name  | <code>string</code> | The name of the attribute or tuple |
| value | <code>string, VNode</code> | The value of the attribute |

#### x(value) ⇒ <code>VNode</code>
Creates a primitive value node, which can contain a javascript primitive (string, number, boolean or null).

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| value | <code>string, number, boolean, null</code> | The value of the node |

#### r(value) ⇒ <code>VNode</code>
Creates a "reference" (or link) node, which can contain a (partial) URI-formatted string.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| value | <code>string</code> | The value of the node |

#### l(children) ⇒ <code>VNode</code>
Creates a list (AKA array) node, which can contain multiple nodes of any type, except `document` and `attribute`.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| children | <code>VNode*</code> | The children of the list (array, ArraySeq or Observable) |

#### m(children) ⇒ <code>VNode</code>
Creates a map (AKA plain object) node, which can contain multiple nodes of type `attribute`.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| children | <code>VNode*</code> | The children of the map (array, ArraySeq or Observable) |

#### d(children) ⇒ <code>VNode</code>
Creates a document node, which can contain a single node of any other type, except `document` and `attribute`, in addition to multiple processing instruction nodes. In general, documents aren't constructed directly, but created by the parser.

This is a top level node, and may not be contained in other nodes.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| children | <code>VNode*</code> | The children of the document (array, ArraySeq or Observable) |

#### p(target,content) ⇒ <code>VNode</code>
Creates a processing instruction node.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| target  | <code>string</code> |  The target part of the PI |
| content | <code>string</code> | The content part of the PI |


#### c(value) ⇒ <code>VNode</code>
Creates a comment node, which can contain a string.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| value | <code>string</code> | The value of the node |


#### f(qname,arguments) ⇒ <code>VNode</code>
Creates a "function call" node, which can contain nodes of any other type, except `attribute`.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| qname | <code>string, QName</code> | The name of the function |
| arguments | <code>Array</code> | The arguments to the function as an array |


#### q(body) ⇒ <code>VNode</code>
Creates a "quotation" (AKA lambda) node, which can contain nodes of any other type, except `attribute`.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| body | <code>Array</code> | The arguments to the function as an array |

___

Notes:

* Constructors are *lazy*: the temporary VNode holds a reference to a function. The node will be actualized when its parent VNode calls this function.
* Once a root node is actualized, all constructor function references will be called recursively to create the actual document structure.
* A document may also be actualized on demand, for example when accessing or modifying a temporary structure.
* Documents can be persistent or non-persistent JSON under the hood. This can be decided when a document is actualized. The VNode interface can also be used to wrap HTML DOM nodes.

____

## Examples

```javascript
import { e, a } from "l3n";

e("div",[
  a("class","greeting"),
  e("p","Hello")
]);
```

HTML serialization (duh):

```html
<div class="greeting">
 <p>Hello</p>
</div>
```

JSON:

```json
{
  "$name":"div",
  "$attrs": {"class":"greeting"},
  "$children":[{
    "$name":"p",
    "$attrs": {},
    "$children":["Hello"]
  }]
}
```

```javascript
import { m, a } from "l3n";

n.m(
  n.a("greeting","Hello")
);
```

HTML serialization:

```html
<l3-m>
 <l3-a name="greeting">Hello</l3-a>
</l3-m>
```

JSON (duh):

```json
{
  "greeting":"Hello"
}
```

____

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
| 12 | teXt | `<l3-x>123</l3-x>` |
| 14 | Function call | `<l3-f name="some-function"></l3-f>` |
| 15 | Quotation | `<l3-q></l3-q>`
