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

### vNode.toString(prettifier) ⇒ <code>String</code>
Render XML representation of a VNode

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>String</code> - Output  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| prettifier | <code>function</code> | <code>x</code> | => x Optional prettifier function |

<a name="VNode+toJS"></a>

### vNode.toJS() ⇒ <code>any</code>
Return JS (JSON) representation (by default this returns the bare document structure)

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>any</code> - [description]  
<a name="VNode+count"></a>

### vNode.count() ⇒ <code>Number</code>
Interface to context's count function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>Number</code> - Count of the node's entries or children  
<a name="VNode+keys"></a>

### vNode.keys() ⇒ <code>Array</code>
Interface to context's keys function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>Array</code> - Keys of the node's entries or children  
<a name="VNode+values"></a>

### vNode.values() ⇒ <code>Array</code>
Interface to context's values function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>Array</code> - The node's values, children or arguments  
<a name="VNode+first"></a>

### vNode.first() ⇒ <code>any</code>
Interface to context's first function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>any</code> - The node's first child, if any  
<a name="VNode+last"></a>

### vNode.last() ⇒ <code>any</code>
Interface to context's last function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>any</code> - The node's last child, if any  
<a name="VNode+next"></a>

### vNode.next() ⇒ <code>any</code>
Interface to context's next function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>any</code> - The node's next child relative to the provided VNode, if any  
<a name="VNode+previous"></a>

### vNode.previous() ⇒ <code>any</code>
Interface to context's previous function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>any</code> - The node's previous child relative to the provided VNode, if any  
<a name="VNode+push"></a>

### vNode.push() ⇒ [<code>VNode</code>](#VNode)
Interface to context's push function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: [<code>VNode</code>](#VNode) - pushes the tuple onto the node's entries or children  
<a name="VNode+set"></a>

### vNode.set() ⇒ [<code>VNode</code>](#VNode)
Interface to context's set function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: [<code>VNode</code>](#VNode) - inserts the pair into a node that can contain pairs  
<a name="VNode+get"></a>

### vNode.get() ⇒ <code>any</code>
Interface to context's get function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>any</code> - retrieves a node's entry or child by key or index  
<a name="VNode+has"></a>

### vNode.has() ⇒ <code>Boolean</code>
Interface to context's has function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>Boolean</code> - checks if a node has an entry or child with provided key or index  
<a name="VNode+removeChild"></a>

### vNode.removeChild() ⇒ [<code>VNode</code>](#VNode)
Interface to context's removeChild function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: [<code>VNode</code>](#VNode) - removes a node's entry or child  
<a name="VNode+finalize"></a>

### vNode.finalize() ⇒ [<code>VNode</code>](#VNode)
Interface to context's finalize function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: [<code>VNode</code>](#VNode) - finalizes a node that's eligible for transient mutations  
<a name="VNode+entries"></a>

### vNode.entries() ⇒ <code>Array</code>
Interface to context's entries function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: <code>Array</code> - retrieves a node's entries (i.e. attributes), if any  
<a name="VNode+modify"></a>

### vNode.modify() ⇒ [<code>VNode</code>](#VNode)
Interface to context's modify function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: [<code>VNode</code>](#VNode) - modifies a node's entries or children, if any  
<a name="VNode+vnode"></a>

### vNode.vnode() ⇒ [<code>VNode</code>](#VNode)
Interface to context's vnode function

**Kind**: instance method of [<code>VNode</code>](#VNode)  
**Returns**: [<code>VNode</code>](#VNode) - allows for the creation of VNode with the same context bound it as this one  
<a name="VNode+create"></a>

### vNode.create() ⇒ <code>any</code>
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
Helper function to determine the currently bound document implementation contextReturns the provided default context if none is bound

**Kind**: global constant  
**Returns**: <code>Object</code> - currently bound context  

| Param | Type | Description |
| --- | --- | --- |
| _this | <code>any</code> | Reference to functions this scope |
| defaultCx | <code>Object</code> | Default document implementation context |

