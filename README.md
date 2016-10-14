[![npm package](https://img.shields.io/badge/npm-0.0.1-orange.svg?style=flat-square)](https://www.npmjs.com/package/react-signature-pad-component)

# React Signature Pad
A [signature pad](https://github.com/szimek/signature_pad) implementation for react.

# Basic Usage

```javascript
var React = require('react');
var SignaturePad = require('react-signature-pad');

React.render(
  <SignaturePad clearButton="true" />,
  document.body
)
```

# Methods

```javascript
<SignaturePad clearButton="true" ref="mySignature" />
...

var signature = this.refs.mySignature;

// Methods

// ===============================================
// isEmpty() - returns boolean
// ===============================================

signature.isEmpty();

// ===============================================
// clear() - clears canvas
// ===============================================

signature.clear();

// ===============================================
// toDataURL() - retrieves image as a data url
// ===============================================

signature.toDataURL();

// ===============================================
// fromDataURL() - writes a base64 image to canvas
// ===============================================

signature.fromDataURL(base64String);

```

### Options
<dl>
<dt>dotSize</dt>
<dd>(float or function) Radius of a single dot.</dd>
<dt>minWidth</dt>
<dd>(float) Minimum width of a line. Defaults to <code>0.5</code>.</dd>
<dt>maxWidth</dt>
<dd>(float) Maximum width of a line. Defaults to <code>2.5</code>.</dd>
<dt>backgroundColor</dt>
<dd>(string) Color used to clear the background. Can be any color format accepted by <code>context.fillStyle</code>. Defaults to <code>"rgba(0,0,0,0)"</code> (transparent black). Use a non-transparent color e.g. <code>"rgb(255,255,255)"</code> (opaque white) if you'd like to save signatures as JPEG images.</dd>
<dt>penColor</dt>
<dd>(string) Color used to draw the lines. Can be any color format accepted by <code>context.fillStyle</code>. Defaults to <code>"black"</code>.</dd>
<dt>velocityFilterWeight</dt>
<dd>(float) Weight used to modify new velocity based on the previous velocity. Defaults to <code>0.7</code>.</dd>
<dt>onBegin</dt>
<dd>(function) Callback when stroke begin.</dd>
<dt>onEnd</dt>
<dd>(function) Callback when stroke end.</dd>
<dt>onClear</dt>
<dd>(function) Callback when on clear button click.</dd>
</dl>

# CSS
In order to make the signature pad work correctly you will need the css as well.  All the relevant styles are in [this file](style.css).

# Example
```bash
$ npm start
```
Then navigate to http://localhost:8080/ in your browser and you should be able to see the signature pad in action.
