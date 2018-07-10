<a name="module_convert"></a>

## convert
Stream conversion


* [convert](#module_convert)
    * [.isLeaf](#module_convert.isLeaf) ⇒ <code>Boolean</code>
    * [.isBranch](#module_convert.isBranch) ⇒ <code>Boolean</code>
    * [.isClose](#module_convert.isClose) ⇒ <code>Boolean</code>
    * [.toVNodeStream($s, [bufSize])](#module_convert.toVNodeStream) ⇒ <code>Observable</code>

<a name="module_convert.isLeaf"></a>

### convert.isLeaf ⇒ <code>Boolean</code>
Check if type is of leaf class

**Kind**: static constant of [<code>convert</code>](#module_convert)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>Number</code> | the type constant to test |

<a name="module_convert.isBranch"></a>

### convert.isBranch ⇒ <code>Boolean</code>
Check if type is of branch class

**Kind**: static constant of [<code>convert</code>](#module_convert)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>Number</code> | the type constant to test |

<a name="module_convert.isClose"></a>

### convert.isClose ⇒ <code>Boolean</code>
Check if type is of close class

**Kind**: static constant of [<code>convert</code>](#module_convert)  
**Returns**: <code>Boolean</code> - result  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>Number</code> | the type constant to test |

<a name="module_convert.toVNodeStream"></a>

### convert.toVNodeStream($s, [bufSize]) ⇒ <code>Observable</code>
Convert an L3 stream directly to a VNode stream, constructing the document while traversingAn L3 stream is a sequence of L3 constants as integers, and names or values as strings (parsers are expected to emit this kind of stream).

**Kind**: static method of [<code>convert</code>](#module_convert)  
**Returns**: <code>Observable</code> - The VNode stream as an Observable  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| $s | <code>Observable</code> |  | The L3 stream as an Observable |
| [bufSize] | <code>Number</code> | <code>1</code> | Optional buffer size. Use NaN or Infinity to buffer everything |

