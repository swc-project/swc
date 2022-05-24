"use strict";
var _class_call_check = require("@swc/helpers/lib/_class_call_check.js").default;
var _create_class = require("@swc/helpers/lib/_create_class.js").default;
var _get = require("@swc/helpers/lib/_get.js").default;
var _get_prototype_of = require("@swc/helpers/lib/_get_prototype_of.js").default;
var _inherits = require("@swc/helpers/lib/_inherits.js").default;
var _wrap_native_super = require("@swc/helpers/lib/_wrap_native_super.js").default;
var _create_super = require("@swc/helpers/lib/_create_super.js").default;
var Element = /*#__PURE__*/ function() {
    function Element() {
        _class_call_check(this, Element);
    }
    _create_class(Element, [
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
    var _super = _create_super(CanvasElement);
    function CanvasElement() {
        _class_call_check(this, CanvasElement);
        return _super.apply(this, arguments);
    }
    _create_class(CanvasElement, [
        {
            key: "createFacets",
            value: function createFacets(hidden) {
                var childElements = this.getChildElements();
            ///
            }
        }
    ]);
    return CanvasElement;
}(_wrap_native_super(Element));
var ColouredCanvasElement = /*#__PURE__*/ function(CanvasElement) {
    _inherits(ColouredCanvasElement, CanvasElement);
    var _super = _create_super(ColouredCanvasElement);
    function ColouredCanvasElement() {
        _class_call_check(this, ColouredCanvasElement);
        return _super.apply(this, arguments);
    }
    _create_class(ColouredCanvasElement, [
        {
            key: "createFacets",
            value: function createFacets(hidden) {
                hidden = _get(_get_prototype_of(ColouredCanvasElement.prototype), "createFacets", this).call(this, hidden); ///
            ///
            }
        }
    ]);
    return ColouredCanvasElement;
}(CanvasElement);
var ColouredSquare = /*#__PURE__*/ function(ColouredCanvasElement) {
    _inherits(ColouredSquare, ColouredCanvasElement);
    var _super = _create_super(ColouredSquare);
    function ColouredSquare() {
        _class_call_check(this, ColouredSquare);
        return _super.apply(this, arguments);
    }
    return ColouredSquare;
}(ColouredCanvasElement);
var bugExample = function() {
    var colouredSquare = new ColouredSquare(), hidden = false;
    colouredSquare.createFacets(hidden);
};
bugExample();
