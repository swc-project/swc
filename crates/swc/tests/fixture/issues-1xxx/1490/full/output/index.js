"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
var _createClass = require("@swc/helpers/lib/_create_class.js").default;
var _get = require("@swc/helpers/lib/_get.js").default;
var _getPrototypeOf = require("@swc/helpers/lib/_get_prototype_of.js").default;
var _inherits = require("@swc/helpers/lib/_inherits.js").default;
var _wrapNativeSuper = require("@swc/helpers/lib/_wrap_native_super.js").default;
var _createSuper = require("@swc/helpers/lib/_create_super.js").default;
var Element = /*#__PURE__*/ function() {
    function Element() {
        _classCallCheck(this, Element);
    }
    _createClass(Element, [
        {
            key: "getChildElements",
            value: function getChildElements() {
                return this.childElements;
            }
        }
    ]);
    return Element;
}();
var CanvasElement = /*#__PURE__*/ function(Element) {
    _inherits(CanvasElement, Element);
    var _super = _createSuper(CanvasElement);
    function CanvasElement() {
        _classCallCheck(this, CanvasElement);
        return _super.apply(this, arguments);
    }
    _createClass(CanvasElement, [
        {
            key: "createFacets",
            value: function createFacets(hidden) {
                var childElements = this.getChildElements();
            ///
            }
        }
    ]);
    return CanvasElement;
}(_wrapNativeSuper(Element));
var ColouredCanvasElement = /*#__PURE__*/ function(CanvasElement) {
    _inherits(ColouredCanvasElement, CanvasElement);
    var _super = _createSuper(ColouredCanvasElement);
    function ColouredCanvasElement() {
        _classCallCheck(this, ColouredCanvasElement);
        return _super.apply(this, arguments);
    }
    _createClass(ColouredCanvasElement, [
        {
            key: "createFacets",
            value: function createFacets(hidden) {
                hidden = _get(_getPrototypeOf(ColouredCanvasElement.prototype), "createFacets", this).call(this, hidden); ///
            ///
            }
        }
    ]);
    return ColouredCanvasElement;
}(CanvasElement);
var ColouredSquare = /*#__PURE__*/ function(ColouredCanvasElement) {
    _inherits(ColouredSquare, ColouredCanvasElement);
    var _super = _createSuper(ColouredSquare);
    function ColouredSquare() {
        _classCallCheck(this, ColouredSquare);
        return _super.apply(this, arguments);
    }
    return ColouredSquare;
}(ColouredCanvasElement);
var bugExample = function() {
    var colouredSquare = new ColouredSquare(), hidden = false;
    colouredSquare.createFacets(hidden);
};
bugExample();
