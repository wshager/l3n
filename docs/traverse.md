<a name="module_traverse"></a>

## traverse
Traversal

<a name="module_traverse.traverse"></a>

### traverse.traverse($node) ⇒ <code>Observable</code>
Traverses a document in depth-first (AKA "document") orderIn addition to every node in the document, a special `Close` node is emitted after every traversed branch.

**Kind**: static method of [<code>traverse</code>](#module_traverse)  
**Returns**: <code>Observable</code> - An Observable stream emitting VNodes  

| Param | Type | Description |
| --- | --- | --- |
| $node | <code>any</code> | (faux) VNode, Observable or any node constructed within the bound context |

