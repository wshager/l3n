<a name="module_convert"></a>

## convert
Stream conversion

<a name="module_convert.toVNodeStream"></a>

### convert.toVNodeStream($s, [bufSize]) ⇒ <code>Observable</code>
Convert an L3 stream directly to a VNode stream, constructing the document while traversingAn L3 stream is a sequence of L3 constants as integers, and names or values as strings (parsers are expected to emit this kind of stream).

**Kind**: static method of [<code>convert</code>](#module_convert)  
**Returns**: <code>Observable</code> - The VNode stream as an Observable  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| $s | <code>Observable</code> |  | The L3 stream as an Observable |
| [bufSize] | <code>Number</code> | <code>1</code> | Optional buffer size. Use NaN or Infinity to buffer everything |

