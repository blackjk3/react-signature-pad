(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"));
	else if(typeof define === 'function' && define.amd)
		define(["React"], factory);
	else if(typeof exports === 'object')
		exports["SignaturePad"] = factory(require("React"));
	else
		root["SignaturePad"] = factory(root["React"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _bezier = __webpack_require__(3);

	var _bezier2 = _interopRequireDefault(_bezier);

	var _point = __webpack_require__(4);

	var _point2 = _interopRequireDefault(_point);

	var SignaturePad = (function (_React$Component) {
	  function SignaturePad(props) {
	    _classCallCheck(this, SignaturePad);

	    _get(Object.getPrototypeOf(SignaturePad.prototype), "constructor", this).call(this, props);

	    this.velocityFilterWeight = this.props.velocityFilterWeight || 0.7;
	    this.minWidth = this.props.minWidth || 0.5;
	    this.maxWidth = this.props.maxWidth || 2.5;
	    this.dotSize = this.props.dotSize || function () {
	      return (this.minWidth + this.maxWidth) / 2;
	    };
	    this.penColor = this.props.penColor || "black";
	    this.backgroundColor = this.props.backgroundColor || "rgba(0,0,0,0)";
	    this.onEnd = this.props.onEnd;
	    this.onBegin = this.props.onBegin;
	  }

	  _inherits(SignaturePad, _React$Component);

	  _createClass(SignaturePad, [{
	    key: "componentDidMount",
	    value: function componentDidMount() {
	      this._canvas = _react2["default"].findDOMNode(this.refs.cv);
	      this._ctx = this._canvas.getContext("2d");
	      this.clear();

	      this._handleMouseEvents();
	      this._handleTouchEvents();
	      this._resizeCanvas();
	    }
	  }, {
	    key: "clear",
	    value: function clear() {
	      var ctx = this._ctx,
	          canvas = this._canvas;

	      ctx.fillStyle = this.backgroundColor;
	      ctx.clearRect(0, 0, canvas.width, canvas.height);
	      ctx.fillRect(0, 0, canvas.width, canvas.height);
	      this._reset();
	    }
	  }, {
	    key: "toDataURL",
	    value: function toDataURL(imageType, quality) {
	      var canvas = this._canvas;
	      return canvas.toDataURL.apply(canvas, arguments);
	    }
	  }, {
	    key: "isEmpty",
	    value: function isEmpty() {
	      return this._isEmpty;
	    }
	  }, {
	    key: "_resizeCanvas",
	    value: function _resizeCanvas() {
	      var ctx = this._ctx,
	          canvas = this._canvas;
	      // When zoomed out to less than 100%, for some very strange reason,
	      // some browsers report devicePixelRatio as less than 1
	      // and only part of the canvas is cleared then.
	      var ratio = Math.max(window.devicePixelRatio || 1, 1);
	      canvas.width = canvas.offsetWidth * ratio;
	      canvas.height = canvas.offsetHeight * ratio;
	      ctx.scale(ratio, ratio);
	    }
	  }, {
	    key: "_reset",
	    value: function _reset() {
	      this.points = [];
	      this._lastVelocity = 0;
	      this._lastWidth = (this.minWidth + this.maxWidth) / 2;
	      this._isEmpty = true;
	      this._ctx.fillStyle = this.penColor;
	    }
	  }, {
	    key: "_handleMouseEvents",
	    value: function _handleMouseEvents() {
	      this._mouseButtonDown = false;

	      this._canvas.addEventListener("mousedown", this._handleMouseDown.bind(this));
	      this._canvas.addEventListener("mousemove", this._handleMouseMove.bind(this));
	      document.addEventListener("mouseup", this._handleMouseUp.bind(this));
	    }
	  }, {
	    key: "_handleTouchEvents",
	    value: function _handleTouchEvents() {
	      // Pass touch events to canvas element on mobile IE.
	      this._canvas.style.msTouchAction = "none";

	      this._canvas.addEventListener("touchstart", this._handleTouchStart.bind(this));
	      this._canvas.addEventListener("touchmove", this._handleTouchMove.bind(this));
	      document.addEventListener("touchend", this._handleTouchEnd.bind(this));
	    }
	  }, {
	    key: "off",
	    value: function off() {
	      this._canvas.removeEventListener("mousedown", this._handleMouseDown);
	      this._canvas.removeEventListener("mousemove", this._handleMouseMove);
	      document.removeEventListener("mouseup", this._handleMouseUp);

	      this._canvas.removeEventListener("touchstart", this._handleTouchStart);
	      this._canvas.removeEventListener("touchmove", this._handleTouchMove);
	      document.removeEventListener("touchend", this._handleTouchEnd);
	    }
	  }, {
	    key: "_handleMouseDown",
	    value: function _handleMouseDown(event) {
	      if (event.which === 1) {
	        this._mouseButtonDown = true;
	        this._strokeBegin(event);
	      }
	    }
	  }, {
	    key: "_handleMouseMove",
	    value: function _handleMouseMove(event) {
	      if (this._mouseButtonDown) {
	        this._strokeUpdate(event);
	      }
	    }
	  }, {
	    key: "_handleMouseUp",
	    value: function _handleMouseUp(event) {
	      if (event.which === 1 && this._mouseButtonDown) {
	        this._mouseButtonDown = false;
	        this._strokeEnd(event);
	      }
	    }
	  }, {
	    key: "_handleTouchStart",
	    value: function _handleTouchStart(event) {
	      var touch = event.changedTouches[0];
	      this._strokeBegin(touch);
	    }
	  }, {
	    key: "_handleTouchMove",
	    value: function _handleTouchMove(event) {
	      // Prevent scrolling.
	      event.preventDefault();

	      var touch = event.changedTouches[0];
	      this._strokeUpdate(touch);
	    }
	  }, {
	    key: "_handleTouchEnd",
	    value: function _handleTouchEnd(event) {
	      var wasCanvasTouched = event.target === this._canvas;
	      if (wasCanvasTouched) {
	        this._strokeEnd(event);
	      }
	    }
	  }, {
	    key: "_strokeUpdate",
	    value: function _strokeUpdate(event) {
	      var point = this._createPoint(event);
	      this._addPoint(point);
	    }
	  }, {
	    key: "_strokeBegin",
	    value: function _strokeBegin(event) {
	      this._reset();
	      this._strokeUpdate(event);
	      if (typeof this.onBegin === "function") {
	        this.onBegin(event);
	      }
	    }
	  }, {
	    key: "_strokeDraw",
	    value: function _strokeDraw(point) {
	      var ctx = this._ctx,
	          dotSize = typeof this.dotSize === "function" ? this.dotSize() : this.dotSize;

	      ctx.beginPath();
	      this._drawPoint(point.x, point.y, dotSize);
	      ctx.closePath();
	      ctx.fill();
	    }
	  }, {
	    key: "_strokeEnd",
	    value: function _strokeEnd(event) {
	      var canDrawCurve = this.points.length > 2,
	          point = this.points[0];

	      if (!canDrawCurve && point) {
	        this._strokeDraw(point);
	      }
	      if (typeof this.onEnd === "function") {
	        this.onEnd(event);
	      }
	    }
	  }, {
	    key: "_createPoint",
	    value: function _createPoint(event) {
	      var rect = this._canvas.getBoundingClientRect();
	      return new _point2["default"](event.clientX - rect.left, event.clientY - rect.top);
	    }
	  }, {
	    key: "_addPoint",
	    value: function _addPoint(point) {
	      var points = this.points,
	          c2,
	          c3,
	          curve,
	          tmp;

	      points.push(point);

	      if (points.length > 2) {
	        // To reduce the initial lag make it work with 3 points
	        // by copying the first point to the beginning.
	        if (points.length === 3) points.unshift(points[0]);

	        tmp = this._calculateCurveControlPoints(points[0], points[1], points[2]);
	        c2 = tmp.c2;
	        tmp = this._calculateCurveControlPoints(points[1], points[2], points[3]);
	        c3 = tmp.c1;
	        curve = new _bezier2["default"](points[1], c2, c3, points[2]);
	        this._addCurve(curve);

	        // Remove the first element from the list,
	        // so that we always have no more than 4 points in points array.
	        points.shift();
	      }
	    }
	  }, {
	    key: "_calculateCurveControlPoints",
	    value: function _calculateCurveControlPoints(s1, s2, s3) {
	      var dx1 = s1.x - s2.x,
	          dy1 = s1.y - s2.y,
	          dx2 = s2.x - s3.x,
	          dy2 = s2.y - s3.y,
	          m1 = { x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0 },
	          m2 = { x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0 },
	          l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1),
	          l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2),
	          dxm = m1.x - m2.x,
	          dym = m1.y - m2.y,
	          k = l2 / (l1 + l2),
	          cm = { x: m2.x + dxm * k, y: m2.y + dym * k },
	          tx = s2.x - cm.x,
	          ty = s2.y - cm.y;

	      return {
	        c1: new _point2["default"](m1.x + tx, m1.y + ty),
	        c2: new _point2["default"](m2.x + tx, m2.y + ty)
	      };
	    }
	  }, {
	    key: "_addCurve",
	    value: function _addCurve(curve) {
	      var startPoint = curve.startPoint,
	          endPoint = curve.endPoint,
	          velocity,
	          newWidth;

	      velocity = endPoint.velocityFrom(startPoint);
	      velocity = this.velocityFilterWeight * velocity + (1 - this.velocityFilterWeight) * this._lastVelocity;

	      newWidth = this._strokeWidth(velocity);
	      this._drawCurve(curve, this._lastWidth, newWidth);

	      this._lastVelocity = velocity;
	      this._lastWidth = newWidth;
	    }
	  }, {
	    key: "_drawPoint",
	    value: function _drawPoint(x, y, size) {
	      var ctx = this._ctx;

	      ctx.moveTo(x, y);
	      ctx.arc(x, y, size, 0, 2 * Math.PI, false);
	      this._isEmpty = false;
	    }
	  }, {
	    key: "_drawCurve",
	    value: function _drawCurve(curve, startWidth, endWidth) {
	      var ctx = this._ctx,
	          widthDelta = endWidth - startWidth,
	          drawSteps,
	          width,
	          i,
	          t,
	          tt,
	          ttt,
	          u,
	          uu,
	          uuu,
	          x,
	          y;

	      drawSteps = Math.floor(curve.length());
	      ctx.beginPath();
	      for (i = 0; i < drawSteps; i++) {
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

	        width = startWidth + ttt * widthDelta;
	        this._drawPoint(x, y, width);
	      }
	      ctx.closePath();
	      ctx.fill();
	    }
	  }, {
	    key: "_strokeWidth",
	    value: function _strokeWidth(velocity) {
	      return Math.max(this.maxWidth / (velocity + 1), this.minWidth);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      return _react2["default"].createElement(
	        "div",
	        { id: "signature-pad", className: "m-signature-pad" },
	        _react2["default"].createElement(
	          "div",
	          { className: "m-signature-pad--body" },
	          _react2["default"].createElement("canvas", { ref: "cv" })
	        )
	      );
	    }
	  }]);

	  return SignaturePad;
	})(_react2["default"].Component);

	exports["default"] = SignaturePad;
	module.exports = exports["default"];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Bezier = (function () {
	  function Bezier(startPoint, control1, control2, endPoint) {
	    _classCallCheck(this, Bezier);

	    this.startPoint = startPoint;
	    this.control1 = control1;
	    this.control2 = control2;
	    this.endPoint = endPoint;
	  }

	  _createClass(Bezier, [{
	    key: "length",
	    value: function length() {
	      var steps = 10,
	          length = 0,
	          i,
	          t,
	          cx,
	          cy,
	          px,
	          py,
	          xdiff,
	          ydiff;

	      for (i = 0; i <= steps; i++) {
	        t = i / steps;
	        cx = this._point(t, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x);
	        cy = this._point(t, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
	        if (i > 0) {
	          xdiff = cx - px;
	          ydiff = cy - py;
	          length += Math.sqrt(xdiff * xdiff + ydiff * ydiff);
	        }
	        px = cx;
	        py = cy;
	      }
	      return length;
	    }
	  }, {
	    key: "_point",
	    value: function _point(t, start, c1, c2, end) {
	      return start * (1.0 - t) * (1.0 - t) * (1.0 - t) + 3.0 * c1 * (1.0 - t) * (1.0 - t) * t + 3.0 * c2 * (1.0 - t) * t * t + end * t * t * t;
	    }
	  }]);

	  return Bezier;
	})();

	exports["default"] = Bezier;
	module.exports = exports["default"];

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Point = (function () {
	  function Point(x, y, time) {
	    _classCallCheck(this, Point);

	    this.x = x;
	    this.y = y;
	    this.time = time || new Date().getTime();
	  }

	  _createClass(Point, [{
	    key: "velocityFrom",
	    value: function velocityFrom(start) {
	      return this.time !== start.time ? this.distanceTo(start) / (this.time - start.time) : 1;
	    }
	  }, {
	    key: "distanceTo",
	    value: function distanceTo(start) {
	      return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2));
	    }
	  }]);

	  return Point;
	})();

	exports["default"] = Point;
	module.exports = exports["default"];

/***/ }
/******/ ])
});
;