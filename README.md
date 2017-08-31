# React Signature Canvas

[![NPM](https://nodei.co/npm/react-signature-canvas.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/package/react-signature-canvas)

A [signature pad](https://github.com/szimek/signature_pad) implementation in
React.

This is an _unopinionated_ fork of
[react-signature-pad](https://github.com/blackjk3/react-signature-pad)
that does not impose any styling or wrap any other unwanted elements around
your canvas -- it's just a wrapper around a single canvas element! Hence the
naming difference.

This fork also allows you to directly pass [props](#props) to the underlying
canvas element, has new, documented [API methods](#api) you can use, and has
new, documented [props](#props) you can pass to it.

## Installation

`npm i -S react-signature-canvas`

## Usage

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import SignatureCanvas from 'react-signature-canvas'

ReactDOM.render(
  <SignatureCanvas penColor='green'
    canvasProps={{width: 500, height: 200, className: 'sigCanvas'}} />,
  document.getElementById('react-container')
)
```

### Props

The props of SignatureCanvas mainly control the properties of the pen stroke
used in drawing. All props are **optional**.

- `velocityFilterWeight` : `number`, default: `0.7`
- `minWidth` : `number`, default: `0.5`
- `maxWidth` : `number`, default: `2.5`
- `dotSize` : `number` or `function`,
  default: `() => (this.props.minWidth + this.props.maxWidth) / 2`
- `penColor` : `string`, default: `'black'`

There are also two callbacks that will be called when a stroke ends and one
begins, respectively.

- `onEnd` : `function`
- `onBegin` : `function`

Additional props are used to control the canvas element.

- `canvasProps`: `object`
  - directly passed to the underlying `<canvas />` element
- `backgroundColor` : `string`, default: `'rgba(0,0,0,0)'`
  - used in the [API's](#api) `clear` convenience method (which itself is
    called internally during resizes)
- `clearOnResize`: `bool`, default: `true`
  - whether or not the canvas should be cleared when the window resizes

### API

All API methods require a ref to the SignatureCanvas in order to use and are
instance methods of the ref.

```javascript
<SignatureCanvas ref={(ref) => { this.sigCanvas = ref }} />
```

- `isEmpty()` : `boolean`, self-explanatory
- `clear()` : `void`, clears the canvas using the `backgroundColor` prop
- `fromDataURL(base64String)` : `void`, writes a base64 image to canvas
- `getCanvas()`: `canvas`, returns the underlying canvas ref. Allows you to
  modify the canvas however you want or call methods such as `toDataURL()`
- `getTrimmedCanvas()`: `canvas`, creates a copy of the canvas and returns a
  trimmed version of it, with all whitespace removed.

## Example

```bash
$ npm start
```

Navigate to [http://localhost:8080/](http://localhost:8080/) in your browser
and you should be able to see the signature canvas in action.

The source code for this example is found in the [`example/`](example/)
directory.
