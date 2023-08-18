// let's refactor this file later
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/require-default-props */
/* eslint-disable react/static-property-placement */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SignaturePad from 'signature_pad';
import trimCanvas from 'trim-canvas';

export default class SignatureCanvas extends Component {
  static propTypes = {
    // signature_pad's props
    velocityFilterWeight: PropTypes.number,
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    minDistance: PropTypes.number,
    dotSize: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    penColor: PropTypes.string,
    throttle: PropTypes.number,
    onEnd: PropTypes.func,
    onBegin: PropTypes.func,
    // props specific to the React wrapper
    // eslint-disable-next-line react/forbid-prop-types
    canvasProps: PropTypes.object,
    clearOnResize: PropTypes.bool,
  };

  static defaultProps = {
    clearOnResize: true,
  };

  _sigPad = null;

  componentDidMount() {
    this._sigPad = new SignaturePad(this._canvas, this._excludeOurProps());
    this._resizeCanvas();
    this.off();
    this.on();
  }

  // propagate prop updates to SignaturePad
  componentDidUpdate() {
    Object.assign(this._sigPad, this._excludeOurProps());
  }

  componentWillUnmount() {
    this.off();
  }

  _excludeOurProps = () => {
    const { canvasProps, clearOnResize, ...sigPadProps } = this.props;
    return sigPadProps;
  };

  // return the canvas ref for operations like toDataURL
  getCanvas = () => this._canvas;

  // return a trimmed copy of the canvas
  getTrimmedCanvas = () => {
    // copy the canvas
    const copy = document.createElement('canvas');
    copy.width = this._canvas.width;
    copy.height = this._canvas.height;
    copy.getContext('2d').drawImage(this._canvas, 0, 0);
    // then trim it
    return trimCanvas(copy);
  };

  // return the internal SignaturePad reference
  getSignaturePad = () => this._sigPad;

  _checkClearOnResize = () => {
    if (!this.props.clearOnResize) {
      return;
    }
    this._resizeCanvas();
  };

  _resizeCanvas = () => {
    const canvasProps = this.props.canvasProps || {};
    const { width, height } = canvasProps;
    // don't resize if the canvas has fixed width and height
    if (width && height) {
      return;
    }

    const canvas = this._canvas;
    // return if there is no canvas
    if (!canvas) {
      return;
    }

    /* When zoomed out to less than 100%, for some very strange reason,
      some browsers report devicePixelRatio as less than 1
      and only part of the canvas is cleared then. */
    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    if (!width) {
      canvas.width = canvas.offsetWidth * ratio;
    }
    if (!height) {
      canvas.height = canvas.offsetHeight * ratio;
    }
    canvas.getContext('2d').scale(ratio, ratio);
    this.clear();
  };

  // all wrapper functions below render
  //
  on = () => {
    window.addEventListener('resize', this._checkClearOnResize);
    return this._sigPad.on();
  };

  off = () => {
    window.removeEventListener('resize', this._checkClearOnResize);
    return this._sigPad.off();
  };

  clear = () => this._sigPad.clear();

  isEmpty = () => this._sigPad.isEmpty();

  fromDataURL = (dataURL, options) => this._sigPad.fromDataURL(dataURL, options);

  toDataURL = (type, encoderOptions) => this._sigPad.toDataURL(type, encoderOptions);

  fromData = (pointGroups) => this._sigPad.fromData(pointGroups);

  toData = () => this._sigPad.toData();

  render() {
    const { canvasProps } = this.props;
    return (
      <canvas
        ref={(ref) => {
          this._canvas = ref;
        }}
        {...canvasProps}
      />
    );
  }
}
