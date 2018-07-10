<a name="module_construct"></a>

## construct
VNode constructors are *lazy*: the temporary VNode holds a reference to a function instead of a concrete structure. The actual tree will be created when its parent VNode calls this function. There are several ways to achieve this:* By ensuring that the tree has a document root (see `ensureDoc`)* By wrapping the tree in a document constructor or document-fragment constructor (see `d` or `t` in [doc](./doc.md))* By traversing the tree (see [traverse](./traverse.md))At this point a 'document implementation context' can be also bound (JSON, DOM or persistent). After that, all functions will be called recursively to create the actual document with the chosen context (see [inode](./inode.md), [pnode](./pnode.md), [dom](./dom.md)).Alternatively a structure can be created by calling the faux VNode's `node` method with a context directly.


* [construct](#module_construct)
    * [.e(name, children)](#module_construct.e) ⇒ <code>VNode</code>
    * [.a(name, children)](#module_construct.a) ⇒ <code>VNode</code>
    * [.x(value)](#module_construct.x) ⇒ <code>VNode</code>
    * [.r(value)](#module_construct.r) ⇒ <code>VNode</code>
    * [.l(children)](#module_construct.l) ⇒ <code>VNode</code>
    * [.m(children)](#module_construct.m) ⇒ <code>VNode</code>
    * [.p(target, content)](#module_construct.p) ⇒ <code>VNode</code>
    * [.c(value)](#module_construct.c) ⇒ <code>VNode</code>
    * [.f(name, name)](#module_construct.f) ⇒ <code>VNode</code>
    * [.q(name)](#module_construct.q) ⇒ <code>VNode</code>

<a name="module_construct.e"></a>

### construct.e(name, children) ⇒ <code>VNode</code>
Creates an element node, which can contain multiple nodes of any type, except `document`.

**Kind**: static method of [<code>construct</code>](#module_construct)  
**Returns**: <code>VNode</code> - A faux VNode  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> \| <code>QName</code> | The name of the element |
| children | <code>VNode</code> | The children of the element |

<a name="module_construct.a"></a>

### construct.a(name, children) ⇒ <code>VNode</code>
Creates an attribute node under an element, or a pair under a map.
Can contain a single node of any other type, except `attribute`.
Note that when serializing to XML, attribute values are converted to a string following serializer parameters.

**Kind**: static method of [<code>construct</code>](#module_construct)  
**Returns**: <code>VNode</code> - A faux VNode  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> \| <code>QName</code> | The name of the attribute or pair |
| children | <code>VNode</code> | The value of the attribute |

<a name="module_construct.x"></a>

### construct.x(value) ⇒ <code>VNode</code>
Creates a primitive value node, which can contain a javascript primitive (string, number, boolean or null).

**Kind**: static method of [<code>construct</code>](#module_construct)  
**Returns**: <code>VNode</code> - A faux VNode  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>String</code> \| <code>Number</code> \| <code>Boolean</code> \| <code>Null</code> | The value of the node |

<a name="module_construct.r"></a>

### construct.r(value) ⇒ <code>VNode</code>
Creates a "reference" (or link) node, which can contain a (partial) URI-formatted string.

**Kind**: static method of [<code>construct</code>](#module_construct)  
**Returns**: <code>VNode</code> - A faux VNode  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>String</code> | The value of the node |

<a name="module_construct.l"></a>

### construct.l(children) ⇒ <code>VNode</code>
Creates a list (AKA array) node, which can contain multiple nodes of any type, except `document` and `attribute`.

**Kind**: static method of [<code>construct</code>](#module_construct)  
**Returns**: <code>VNode</code> - A faux VNode  

| Param | Type | Description |
| --- | --- | --- |
| children | <code>VNode</code> | The children of the list |

<a name="module_construct.m"></a>

### construct.m(children) ⇒ <code>VNode</code>
Creates a map (AKA plain object) node, which can contain multiple nodes of type `attribute`.

**Kind**: static method of [<code>construct</code>](#module_construct)  
**Returns**: <code>VNode</code> - A faux VNode  

| Param | Type | Description |
| --- | --- | --- |
| children | <code>VNode</code> | The children of the map |

<a name="module_construct.p"></a>

### construct.p(target, content) ⇒ <code>VNode</code>
Creates a processing instruction node.

**Kind**: static method of [<code>construct</code>](#module_construct)  
**Returns**: <code>VNode</code> - A faux VNode  

| Param | Type | Description |
| --- | --- | --- |
| target | <code>String</code> | The target part of the PI |
| content | <code>String</code> | The content part of the PI |

<a name="module_construct.c"></a>

### construct.c(value) ⇒ <code>VNode</code>
Creates a comment node, which can contain a string.

**Kind**: static method of [<code>construct</code>](#module_construct)  
**Returns**: <code>VNode</code> - A faux VNode  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>String</code> | The value of the node |

<a name="module_construct.f"></a>

### construct.f(name, name) ⇒ <code>VNode</code>
Creates a "function call" node, which can contain nodes of any other type.

**Kind**: static method of [<code>construct</code>](#module_construct)  
**Returns**: <code>VNode</code> - A faux VNode  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> \| <code>QName</code> | The name of the function |
| name | <code>VNode</code> | The arguments to the function |

<a name="module_construct.q"></a>

### construct.q(name) ⇒ <code>VNode</code>
Creates a "quotation" (AKA lambda) node, which can contain nodes of any other type.

**Kind**: static method of [<code>construct</code>](#module_construct)  
**Returns**: <code>VNode</code> - A faux VNode  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>VNode</code> | The body of the function |

