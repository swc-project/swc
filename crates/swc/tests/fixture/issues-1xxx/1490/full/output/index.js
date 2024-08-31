"use strict";
var _call_super = require("@swc/helpers/_/_call_super");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var _get = require("@swc/helpers/_/_get");
var _get_prototype_of = require("@swc/helpers/_/_get_prototype_of");
var _inherits = require("@swc/helpers/_/_inherits");
var _wrap_native_super = require("@swc/helpers/_/_wrap_native_super");
var Element = /*#__PURE__*/ function() {
    function Element() {
        _class_call_check._(this, Element);
    }
    _create_class._(Element, [
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
    _inherits._(CanvasElement, Element);
    function CanvasElement() {
        _class_call_check._(this, CanvasElement);
        return _call_super._(this, CanvasElement, arguments);
    }
    _create_class._(CanvasElement, [
        {
            key: "createFacets",
            value: function createFacets(hidden) {
                var childElements = this.getChildElements();
            ///
            }
        }
    ]);
    return CanvasElement;
}(_wrap_native_super._(Element));
var ColouredCanvasElement = /*#__PURE__*/ function(CanvasElement) {
    _inherits._(ColouredCanvasElement, CanvasElement);
    function ColouredCanvasElement() {
        _class_call_check._(this, ColouredCanvasElement);
        return _call_super._(this, ColouredCanvasElement, arguments);
    }
    _create_class._(ColouredCanvasElement, [
        {
            key: "createFacets",
            value: function createFacets(hidden) {
                hidden = _get._(_get_prototype_of._(ColouredCanvasElement.prototype), "createFacets", this).call(this, hidden); ///
            ///
            }
        }
    ]);
    return ColouredCanvasElement;
}(CanvasElement);
var ColouredSquare = /*#__PURE__*/ function(ColouredCanvasElement) {
    _inherits._(ColouredSquare, ColouredCanvasElement);
    function ColouredSquare() {
        _class_call_check._(this, ColouredSquare);
        return _call_super._(this, ColouredSquare, arguments);
    }
    return ColouredSquare;
}(ColouredCanvasElement);
var bugExample = function() {
    var colouredSquare = new ColouredSquare(), hidden = false;
    colouredSquare.createFacets(hidden);
};
bugExample();
