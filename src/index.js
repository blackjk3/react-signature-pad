import React, { PropTypes } from 'react';
import Bezier from './bezier';
import Point from './point';

export default class SignaturePad extends React.Component {

  constructor(props) {
    super(props);

    this.velocityFilterWeight = this.props.velocityFilterWeight;
    this.minWidth = this.props.minWidth;
    this.maxWidth = this.props.maxWidth;
    this.dotSize = this.props.dotSize;
    this.penColor = this.props.penColor;
    this.backgroundColor = this.props.backgroundColor;
    this.onEnd = this.props.onEnd;
    this.onBegin = this.props.onBegin;
  }

  componentDidMount() {
    this._canvas = this.cv;
    this._ctx = this._canvas.getContext('2d');
    this.clear();

    this._handleMouseEvents();
    this._handleTouchEvents();
    this._resizeCanvas();
  }

  componentWillUnmount() {
    this.off();
  }

  clear(e) {
    if (e) {
      e.preventDefault();
    }
    const ctx = this._ctx;
    const canvas = this._canvas;

    ctx.fillStyle = this.backgroundColor;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this._reset();
  }

  toDataURL(...args) {
    const canvas = this._canvas;
    return canvas.toDataURL(canvas, args);
  }

  fromDataURL(dataUrl) {
    const self = this;
    const image = new Image();
    const ratio = window.devicePixelRatio || 1;
    const width = this._canvas.width / ratio;
    const height = this._canvas.height / ratio;

    this._reset();
    image.src = dataUrl;
    image.onload = function draw() {
      self._ctx.drawImage(image, 0, 0, width, height);
    };
    this._isEmpty = false;
  }

  isEmpty() {
    return this._isEmpty;
  }

  _resizeCanvas() {
    const ctx = this._ctx;
    const canvas = this._canvas;
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;

    ctx.scale(ratio, ratio);
    this._isEmpty = true;
  }

  _reset() {
    this.points = [];
    this._lastVelocity = 0;
    this._lastWidth = (this.minWidth + this.maxWidth) / 2;
    this._isEmpty = true;
    this._ctx.fillStyle = this.penColor;
  }

  _handleMouseEvents() {
    this._mouseButtonDown = false;

    this._canvas.addEventListener('mousedown', this._handleMouseDown.bind(this));
    this._canvas.addEventListener('mousemove', this._handleMouseMove.bind(this));
    document.addEventListener('mouseup', this._handleMouseUp.bind(this));
    window.addEventListener('resize', this._resizeCanvas.bind(this));
  }

  _handleTouchEvents() {
    // Pass touch events to canvas element on mobile IE.
    this._canvas.style.msTouchAction = 'none';

    this._canvas.addEventListener('touchstart', this._handleTouchStart.bind(this));
    this._canvas.addEventListener('touchmove', this._handleTouchMove.bind(this));
    document.addEventListener('touchend', this._handleTouchEnd.bind(this));
  }

  off() {
    this._canvas.removeEventListener('mousedown', this._handleMouseDown);
    this._canvas.removeEventListener('mousemove', this._handleMouseMove);
    document.removeEventListener('mouseup', this._handleMouseUp);

    this._canvas.removeEventListener('touchstart', this._handleTouchStart);
    this._canvas.removeEventListener('touchmove', this._handleTouchMove);
    document.removeEventListener('touchend', this._handleTouchEnd);
    /* eslint-disable  no-restricted-globals */
    window.removeEventListener('resize', this._resizeCanvas);
  }

  _handleMouseDown(event) {
    if (event.which === 1) {
      this._mouseButtonDown = true;
      this._strokeBegin(event);
    }
  }

  _handleMouseMove(event) {
    if (this._mouseButtonDown) {
      this._strokeUpdate(event);
    }
  }

  _handleMouseUp(event) {
    if (event.which === 1 && this._mouseButtonDown) {
      this._mouseButtonDown = false;
      this._strokeEnd(event);
    }
  }

  _handleTouchStart(event) {
    const touch = event.changedTouches[0];
    this._strokeBegin(touch);
  }

  _handleTouchMove(event) {
    // Prevent scrolling.
    event.preventDefault();

    const touch = event.changedTouches[0];
    this._strokeUpdate(touch);
  }

  _handleTouchEnd(event) {
    const wasCanvasTouched = event.target === this._canvas;
    if (wasCanvasTouched) {
      this._strokeEnd(event);
    }
  }

  _strokeUpdate(event) {
    const point = this._createPoint(event);
    this._addPoint(point);
  }

  _strokeBegin(event) {
    this._reset();
    this._strokeUpdate(event);
    if (typeof this.onBegin === 'function') {
      this.onBegin(event);
    }
  }

  _strokeDraw(point) {
    const ctx = this._ctx;
    const dotSize = this.dotSize;

    ctx.beginPath();
    this._drawPoint(point.x, point.y, dotSize);
    ctx.closePath();
    ctx.fill();
  }

  _strokeEnd(event) {
    const canDrawCurve = this.points.length > 2;
    const point = this.points[0];

    if (!canDrawCurve && point) {
      this._strokeDraw(point);
    }
    if (typeof this.onEnd === 'function') {
      this.onEnd(event);
    }
  }

  _createPoint(event) {
    const rect = this._canvas.getBoundingClientRect();
    return new Point(
      event.clientX - rect.left,
      event.clientY - rect.top,
    );
  }

  _addPoint(point) {
    const points = this.points;
    let c2;
    let c3;
    let curve;
    let tmp;

    points.push(point);

    if (points.length > 2) {
      // To reduce the initial lag make it work with 3 points
      // by copying the first point to the beginning.
      if (points.length === 3) points.unshift(points[0]);

      tmp = this._calculateCurveControlPoints(points[0], points[1], points[2]);
      c2 = tmp.c2;
      tmp = this._calculateCurveControlPoints(points[1], points[2], points[3]);
      c3 = tmp.c1;
      curve = new Bezier(points[1], c2, c3, points[2]);
      this._addCurve(curve);

      // Remove the first element from the list,
      // so that we always have no more than 4 points in points array.
      points.shift();
    }
  }

  _calculateCurveControlPoints(s1, s2, s3) {
    const dx1 = s1.x - s2.x;
    const dy1 = s1.y - s2.y;
    const dx2 = s2.x - s3.x;
    const dy2 = s2.y - s3.y;

    const m1 = { x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0 };
    const m2 = { x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0 };

    const l1 = Math.sqrt((dx1 * dx1) + (dy1 * dy1));
    const l2 = Math.sqrt((dx2 * dx2) + (dy2 * dy2));

    const dxm = (m1.x - m2.x);
    const dym = (m1.y - m2.y);

    const k = l2 / (l1 + l2);
    const cm = { x: m2.x + (dxm * k), y: m2.y + (dym * k) };

    const tx = s2.x - cm.x;
    const ty = s2.y - cm.y;

    return {
      c1: new Point(m1.x + tx, m1.y + ty),
      c2: new Point(m2.x + tx, m2.y + ty),
    };
  }

  _addCurve(curve) {
    const startPoint = curve.startPoint;
    const endPoint = curve.endPoint;
    let velocity;

    velocity = endPoint.velocityFrom(startPoint);
    velocity = (this.velocityFilterWeight * velocity)
        + ((1 - this.velocityFilterWeight) * this._lastVelocity);

    const newWidth = this._strokeWidth(velocity);
    this._drawCurve(curve, this._lastWidth, newWidth);

    this._lastVelocity = velocity;
    this._lastWidth = newWidth;
  }

  _drawPoint(x, y, size) {
    const ctx = this._ctx;

    ctx.moveTo(x, y);
    ctx.arc(x, y, size, 0, 2 * Math.PI, false);
    this._isEmpty = false;
  }

  _drawCurve(curve, startWidth, endWidth) {
    const ctx = this._ctx;
    const widthDelta = endWidth - startWidth;
    let width;
    let i;
    let t;
    let tt;
    let ttt;
    let u;
    let uu;
    let uuu;
    let x;
    let y;

    const drawSteps = Math.floor(curve.length());
    ctx.beginPath();
    for (i = 0; i < drawSteps; i + 1) {
      // Calculate the Bezier (x, y) coordinate for this step.
      t = i / drawSteps;
      tt = t * t;
      ttt = tt * t;
      u = 1 - t;
      uu = u * u;
      uuu = uu * u;

      x = uuu * curve.startPoint.x;
      x += 3 * uu * t * curve.control1.x;
      x += 3 * u * tt * curve.control2.x;
      x += ttt * curve.endPoint.x;

      y = uuu * curve.startPoint.y;
      y += 3 * uu * t * curve.control1.y;
      y += 3 * u * tt * curve.control2.y;
      y += ttt * curve.endPoint.y;

      width = startWidth + (ttt * widthDelta);
      this._drawPoint(x, y, width);
    }
    ctx.closePath();
    ctx.fill();
  }

  _strokeWidth(velocity) {
    return Math.max(this.maxWidth / (velocity + 1), this.minWidth);
  }

  render() {
    return (
      <div id="signature-pad" className="m-signature-pad">
        <div className="m-signature-pad--body">
          <canvas ref={(canvas) => { this.cv = canvas; }} />
        </div>
        { this.props.clearButton &&
          <div className="m-signature-pad--footer">
            <button className="btn btn-default button clear" onClick={() => this.clear()}>Clear</button>
          </div>
        }
      </div>
    );
  }
}

SignaturePad.propTypes = {
  velocityFilterWeight: PropTypes.number,
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number,
  dotSize: PropTypes.number,
  penColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  onEnd: PropTypes.func,
  onBegin: PropTypes.func,
  clearButton: PropTypes.bool,
};

SignaturePad.defaultProps = {
  velocityFilterWeight: 0.7,
  minWidth: 0.5,
  maxWidth: 2.5,
  dotSize: 1.5,
  penColor: 'black',
  backgroundColor: 'rgba(0,0,0,0)',
  onEnd: () => console.log('onEnd'),
  onBegin: () => console.log('onBegin'),
  clearButton: true,
};
