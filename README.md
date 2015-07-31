# React Signature Pad
A [signature pad](https://github.com/szimek/signature_pad) implementation for react.

# Usage

```javascript
var React = require('react');
var SignaturePad = require('react-signature-pad');

React.render(
  <SignaturePad clearButton="true" />,
  document.body
)
```

# CSS
In order to make the signature pad work correctly you will need the css as well.  All the relevant styles are in [this file](style.css).

# Example
```bash
$ npm start
```
Then navigate to http://localhost:8080/ in your browser and you should be able to see the signature pad in action.