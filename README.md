# L3N: Flat Trees!

Construct and traverse trees with a coherent set of functions.

L3 trees can express HTML, XML, JSON or functional programs.


## The Concept

Many documents can be iterated as a flat sequence of nodes, be it an XML or HTML document, a piece of JSON or even a functional program (see [Raddle](https://npmjs.com/raddle)). The way documents are traversed is in *document order*, just like a SAX parser: an event is emitted for when a branch opens or closes, or when a (text) leaf is completed.

This library stores all familiar document nodes as plain JSON by using a simple convention. Traversal of documents is exposes as an Observable stream (uses RxJS 6). This ensures that there's no difference between traversing an in-memory tree or connecting to a SAX-style parser: everything is a stream.

Each node that is emitted on the stream is wrapped in a transient container that provides a reference to the parent node (see the `VNode` class). In addition, the `VNode` interface exposes more relevant properties, such as its depth relative to the root or its position relative to its parent. These enable traversal across all DOM axes. Furthermore, node names and values may be indexed to increase performance.

This library provides an immutable alternative to plain JSON (via the `pnode` context) and a native DOM context for the browser. The traversal context may be switched by simply binding each accessor function to another context module.

For native DOM traversal in the browser, the `VNode` integrates with the canonical TreeWalker API (uses ES6 WeakMap).

Note: you should not create references to VNode instances, or they can't be garbage collected. Transform them functionally instead, by using RxJS or a specialized library (see [Frink](https://npmjs.com/frink)).


## API (WIP)

## Classes

<dl>
<dt><a href="#VNode">VNode</a> : <code><a href="#VNode">VNode</a></code></dt>
<dd><p>core interface to communicate with nodes</p>
</dd>
<dt><a href="#Close">Close</a> : <code><a href="#Close">Close</a></code></dt>
<dd><p>Create a VNode that explicitly closes a branch</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#isVNode">isVNode</a> ⇒ <code>Boolean</code></dt>
<dd><p>Test if VNode</p>
</dd>
<dt><a href="#getContext">getContext</a> ⇒ <code>Object</code></dt>
<dd><p>Helper function to determine the currently bound document implementation context
Returns the provided default context if none is bound</p>
</dd>
</dl>

<a name="VNode"></a>

## VNode : [<code>VNode</code>](#VNode)
core interface to communicate with nodes

**Kind**: global class  

* [VNode](#VNode) : [<code>VNode</code>](#VNode)
    * [new exports.VNode(cx, node, type, name, key, value, parent, deptht, indexInParent, cache)](#new_VNode_new)
    * [.toString(prettifier)](#VNode+toString) ⇒ <code>String</code>
    * [.toJS()](#VNode+toJS) ⇒ <code>any</code>
    * [.count()](#VNode+count) ⇒ <code>Number</code>
    * [.keys()](#VNode+keys) ⇒ <code>Array</code>
    * [.values()](#VNode+values) ⇒ <code>Array</code>
    * [.first()](#VNode+first) ⇒ <code>any</code>
    * [.last()](#VNode+last) ⇒ <code>any</code>
    * [.next()](#VNode+next) ⇒ <code>any</code>
    * [.previous()](#VNode+previous) ⇒ <code>any</code>
    * [.push()](#VNode+push) ⇒ [<code>VNode</code>](#VNode)
    * [.set()](#VNode+set) ⇒ [<code>VNode</code>](#VNode)
    * [.get()](#VNode+get) ⇒ <code>any</code>
    * [.has()](#VNode+has) ⇒ <code>Boolean</code>
    * [.removeChild()](#VNode+removeChild) ⇒ [<code>VNode</code>](#VNode)
    * [.finalize()](#VNode+finalize) ⇒ [<code>VNode</code>](#VNode)
    * [.entries()](#VNode+entries) ⇒ <code>Array</code>
    * [.modify()](#VNode+modify) ⇒ [<code>VNode</code>](#VNode)
    * [.vnode()](#VNode+vnode) ⇒ [<code>VNode</code>](#VNode)
    * [.create()](#VNode+create) ⇒ <code>any</code>

<a name="new_VNode_new"></a>

### new exports.VNode(cx, node, type, name, key, value, parent, deptht, indexInParent, cache)
Create VNode


| Param | Type | Description |
| --- | --- | --- |
| cx | <code>Object</code> | Document implementation context |
| node | <code>Object</code> | Bare node |
| type | <code>Number</code> | Node type |
| name | <code>String</code> | Node name (if available) |
| key | <code>String</code> | Node key (available on pairs in objects only) |
| value | <code>any</code> | Node value (available on leafs only) |
| parent | [<code>VNode</code>](#VNode) | Parent in the document |
| deptht | <code>Number</code> | Depth relative to the document |
| indexInParent | <code>Number</code> | Position relative to the parent |
| cache | <code>Object</code> | Optional cache for fast access |

<a name="VNode+toString"></a>

### VNode.toString(prettifier) ⇒ <code>String</code>
Render XML representation of a VNode

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>String</code> - Output  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| prettifier | <code>function</code> | <code>x</code> | => x Optional prettifier function |

<a name="VNode+toJS"></a>

### VNode.toJS() ⇒ <code>any</code>
Return JS (JSON) representation (by default this returns the bare document structure)

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>any</code> - [description]  
<a name="VNode+count"></a>

### VNode.count() ⇒ <code>Number</code>
Interface to context's count function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>Number</code> - Count of the node's entries or children  
<a name="VNode+keys"></a>

### VNode.keys() ⇒ <code>Array</code>
Interface to context's keys function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>Array</code> - Keys of the node's entries or children  
<a name="VNode+values"></a>

### VNode.values() ⇒ <code>Array</code>
Interface to context's values function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>Array</code> - The node's values, children or arguments  
<a name="VNode+first"></a>

### VNode.first() ⇒ <code>any</code>
Interface to context's first function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>any</code> - The node's first child, if any  
<a name="VNode+last"></a>

### VNode.last() ⇒ <code>any</code>
Interface to context's last function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>any</code> - The node's last child, if any  
<a name="VNode+next"></a>

### VNode.next() ⇒ <code>any</code>
Interface to context's next function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>any</code> - The node's next child relative to the provided VNode, if any  
<a name="VNode+previous"></a>

### VNode.previous() ⇒ <code>any</code>
Interface to context's previous function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>any</code> - The node's previous child relative to the provided VNode, if any  
<a name="VNode+push"></a>

### VNode.push() ⇒ [<code>VNode</code>](#VNode)
Interface to context's push function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: [<code>VNode</code>](#VNode) - pushes the tuple onto the node's entries or children  
<a name="VNode+set"></a>

### VNode.set() ⇒ [<code>VNode</code>](#VNode)
Interface to context's set function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: [<code>VNode</code>](#VNode) - inserts the pair into a node that can contain pairs  
<a name="VNode+get"></a>

### VNode.get() ⇒ <code>any</code>
Interface to context's get function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>any</code> - retrieves a node's entry or child by key or index  
<a name="VNode+has"></a>

### VNode.has() ⇒ <code>Boolean</code>
Interface to context's has function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>Boolean</code> - checks if a node has an entry or child with provided key or index  
<a name="VNode+removeChild"></a>

### VNode.removeChild() ⇒ [<code>VNode</code>](#VNode)
Interface to context's removeChild function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: [<code>VNode</code>](#VNode) - removes a node's entry or child  
<a name="VNode+finalize"></a>

### VNode.finalize() ⇒ [<code>VNode</code>](#VNode)
Interface to context's finalize function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: [<code>VNode</code>](#VNode) - finalizes a node that's eligible for transient mutations  
<a name="VNode+entries"></a>

### VNode.entries() ⇒ <code>Array</code>
Interface to context's entries function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>Array</code> - retrieves a node's entries (i.e. attributes), if any  
<a name="VNode+modify"></a>

### VNode.modify() ⇒ [<code>VNode</code>](#VNode)
Interface to context's modify function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: [<code>VNode</code>](#VNode) - modifies a node's entries or children, if any  
<a name="VNode+vnode"></a>

### VNode.vnode() ⇒ [<code>VNode</code>](#VNode)
Interface to context's vnode function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: [<code>VNode</code>](#VNode) - allows for the creation of VNode with the same context bound it as this one  
<a name="VNode+create"></a>

### VNode.create() ⇒ <code>any</code>
Interface to context's create function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>any</code> - allows for the creation of bare nodes within the bound context  
<a name="Close"></a>

## Close : [<code>Close</code>](#Close)
Create a VNode that explicitly closes a branch

**Kind**: global class  

* [Close](#Close) : [<code>Close</code>](#Close)
    * [new exports.Close(node)](#new_Close_new)
    * [.toString()](#Close+toString) ⇒ <code>String</code>

<a name="new_Close_new"></a>

### new exports.Close(node)
Create a Close


| Param | Type | Description |
| --- | --- | --- |
| node | [<code>VNode</code>](#VNode) | The VNode that is closed |

<a name="Close+toString"></a>

### close.toString() ⇒ <code>String</code>
Helper method to visualize the branch closer

**Kind**: instance method of [<code>Close</code>](#Close)  
**Returns**: <code>String</code> - Output  
<a name="isVNode"></a>

## isVNode ⇒ <code>Boolean</code>
Test if VNode

**Kind**: global constant  

| Param | Type | Description |
| --- | --- | --- |
| n | <code>any</code> | Object to test |

<a name="getContext"></a>

## getContext ⇒ <code>Object</code>
Helper function to determine the currently bound document implementation context
Returns the provided default context if none is bound

**Kind**: global constant  
**Returns**: <code>Object</code> - currently bound context  

| Param | Type | Description |
| --- | --- | --- |
| _this | <code>any</code> | Reference to functions this scope |
| defaultCx | <code>Object</code> | Default document implementation context |




### Constructors

VNode constructors are *lazy*: the temporary VNode holds a reference to a function instead of a concrete structure. The actual tree will be created when its parent VNode calls this function. There are several ways to achieve this:

* By ensuring that the tree has a document root (see `ensureDoc`)
* By wrapping the tree in a document constructor or document-fragment constructor (see `d` or `t`)
* By traversing the tree (see `traverse`)

At this point the construction *context* can be also bound (JSON, DOM or persistent). After that, all functions will be called recursively to create the actual document with the chosen context.

#### e(name, ...children) ⇒ <code>VNode</code>
Creates an element node, which can contain multiple nodes of any type, except `document`.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| name  | <code>String|QName</code> | The name of the element |
| children | <code>VNode*</code> | The children of the element |

#### a(name,value) ⇒ <code>VNode</code>
Creates an attribute node under an element, or a tuple under a map. Can contain a single node of any other type, except `attribute`. Note that when serializing to XML, attribute values are converted to a string following serializer parameters.

When the parent is not an element or map, an error will be produced.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| name  | <code>String</code> | The name of the attribute or tuple |
| value | <code>String|VNode</code> | The value of the attribute |

#### x(value) ⇒ <code>VNode</code>
Creates a primitive value node, which can contain a javascript primitive (string, number, boolean or null).

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| value | <code>String|Number|Boolean</code> | The value of the node |

#### r(value) ⇒ <code>VNode</code>
Creates a "reference" (or link) node, which can contain a (partial) URI-formatted string.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| value | <code>String</code> | The value of the node |

#### l(...children) ⇒ <code>VNode</code>
Creates a list (AKA array) node, which can contain multiple nodes of any type, except `document` and `attribute`.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| children | <code>VNode*</code> | The children of the list |

#### m(...children) ⇒ <code>VNode</code>
Creates a map (AKA plain object) node, which can contain multiple nodes of type `attribute`.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| children | <code>VNode*</code> | The children of the map |

#### p(target,content) ⇒ <code>VNode</code>
Creates a processing instruction node.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| target  | <code>String</code> | The target part of the PI |
| content | <code>String</code> | The content part of the PI |

#### c(value) ⇒ <code>VNode</code>
Creates a comment node, which can contain a string.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| value | <code>String</code> | The value of the node |

#### d(...children) ⇒ <code>VNode*</code>
Creates a document node, which can contain a nodes of any other type.

This is a top level node, and may not be contained in other nodes.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| children | <code>VNode*</code> | The children of the document |

#### t(...children) ⇒ <code>VNode*</code>
Creates a document-fragment node, which can contain nodes of any other type.

This is a top level node, and may not be contained in other nodes.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| children | <code>VNode*</code> | The children of the document-fragment |

#### f(qname,args) ⇒ <code>VNode</code>
Creates a "function call" node, which can contain nodes of any other type.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| qname | <code>String, QName</code> | The name of the function |
| args | <code>VNode*</code> | The arguments to the function |

#### q(args) ⇒ <code>VNode</code>
Creates a "quotation" (AKA lambda) node, which can contain nodes of any other type.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| args | <code>VNode*</code> | The body of the function |

#### ensureDoc(node) => <code>VNode*</code>
Makes sure a tree is always wrapped in a document or document-fragment.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| node | <code>any</code> | The node to wrap (plain JSON is converted to VNode) |


### Traversal

#### traverse(doc) => <code>VNode*</code>
Traverses a document as a stream, in depth-first order, emitting a special `Close` node after every traversed branch.

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| doc | <code>VNode*</code> | The VNode to traverse |


### Stream conversion

#### toVNodeStream(stream,bufSize) => <code>VNode*</code>
Converts an L3 stream into a VNode stream. This function expects a sequence of L3 constants as integers, and names or values as strings (parsers are expected to emit this kind of stream).

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
| stream | <code>Observable<String|Number></code> | The L3 stream as an Observable |



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
