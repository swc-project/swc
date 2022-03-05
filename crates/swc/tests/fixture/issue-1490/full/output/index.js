"use strict";
var swcHelpers = require("@swc/helpers");
var Element = /*#__PURE__*/ function() {
    function Element() {
        swcHelpers.classCallCheck(this, Element);
    }
    swcHelpers.createClass(Element, [
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
    swcHelpers.inherits(CanvasElement, Element);
    var _super = swcHelpers.createSuper(CanvasElement);
    function CanvasElement() {
        swcHelpers.classCallCheck(this, CanvasElement);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(CanvasElement, [
        {
            key: "createFacets",
            value: function createFacets(hidden) {
                var childElements = this.getChildElements();
            ///
            }
        }
    ]);
    return CanvasElement;
}(swcHelpers.wrapNativeSuper(Element));
var ColouredCanvasElement = /*#__PURE__*/ function(CanvasElement) {
    swcHelpers.inherits(ColouredCanvasElement, CanvasElement);
    var _super = swcHelpers.createSuper(ColouredCanvasElement);
    function ColouredCanvasElement() {
        swcHelpers.classCallCheck(this, ColouredCanvasElement);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(ColouredCanvasElement, [
        {
            key: "createFacets",
            value: function createFacets(hidden) {
                hidden = swcHelpers.get(swcHelpers.getPrototypeOf(ColouredCanvasElement.prototype), "createFacets", this).call(this, hidden); ///
            ///
            }
        }
    ]);
    return ColouredCanvasElement;
}(CanvasElement);
var ColouredSquare = /*#__PURE__*/ function(ColouredCanvasElement) {
    swcHelpers.inherits(ColouredSquare, ColouredCanvasElement);
    var _super = swcHelpers.createSuper(ColouredSquare);
    function ColouredSquare() {
        swcHelpers.classCallCheck(this, ColouredSquare);
        return _super.apply(this, arguments);
    }
    return ColouredSquare;
}(ColouredCanvasElement);
var bugExample = function() {
    var colouredSquare = new ColouredSquare(), hidden = false;
    colouredSquare.createFacets(hidden);
};
bugExample();
