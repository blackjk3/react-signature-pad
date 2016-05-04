[![npm package](https://img.shields.io/badge/npm-0.0.5-orange.svg?style=flat-square)](https://www.npmjs.com/package/react-signature-pad)

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

# CSS
In order to make the signature pad work correctly you will need the css as well.  All the relevant styles are in [this file](style.css).

# Example
```bash
$ npm start
```
Then navigate to http://localhost:8080/ in your browser and you should be able to see the signature pad in action.
