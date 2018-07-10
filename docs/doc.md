<a name="module_doc"></a>

## doc
Document-related


* [doc](#module_doc)
    * [.ensureDoc($node)](#module_doc.ensureDoc) ⇒ <code>Observable</code>
    * [.d(children)](#module_doc.d) ⇒ <code>VNode</code>
    * [.t(children)](#module_doc.t) ⇒ <code>VNode</code>
    * [.doctype(name, publicId, systemId)](#module_doc.doctype) ⇒ <code>VNode</code>

<a name="module_doc.ensureDoc"></a>

### doc.ensureDoc($node) ⇒ <code>Observable</code>
Wraps a document into a document-fragment if it doesn't have a document root

**Kind**: static method of [<code>doc</code>](#module_doc)  
**Returns**: <code>Observable</code> - Observable yielding a single VNode  

| Param | Type | Description |
| --- | --- | --- |
| $node | <code>any</code> | Observable, VNode or any kind of node mathing the provided document implementation context |

<a name="module_doc.d"></a>

### doc.d(children) ⇒ <code>VNode</code>
Creates a document node, which can contain a nodes of any other type.
This is a top level node, and may not be contained in other nodes.

**Kind**: static method of [<code>doc</code>](#module_doc)  
**Returns**: <code>VNode</code> - A VNode containing a document  

| Param | Type | Description |
| --- | --- | --- |
| children | <code>VNode</code> | The children of the document |

<a name="module_doc.t"></a>

### doc.t(children) ⇒ <code>VNode</code>
Creates a document-fragment node, which can contain nodes of any other type.
This is a top level node, and may not be contained in other nodes.

**Kind**: static method of [<code>doc</code>](#module_doc)  
**Returns**: <code>VNode</code> - A VNode containing a document-fragment  

| Param | Type | Description |
| --- | --- | --- |
| children | <code>VNode</code> | The children of the document-fragment |

<a name="module_doc.doctype"></a>

### doc.doctype(name, publicId, systemId) ⇒ <code>VNode</code>
Creates a document type node.

**Kind**: static method of [<code>doc</code>](#module_doc)  
**Returns**: <code>VNode</code> - A faux VNode  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>String</code> |  | The qualified name |
| publicId | <code>String</code> | <code>&quot;&quot;</code> | The PUBLIC identifier |
| systemId | <code>String</code> | <code>&quot;&quot;</code> | The SYSTEM identifier |

