var _classCallCheckMjs = require("@swc/helpers/lib/_class_call_check.js").default;
var _createClassMjs = require("@swc/helpers/lib/_create_class.js").default;
var _getMjs = require("@swc/helpers/lib/_get.js").default;
var _getPrototypeOfMjs = require("@swc/helpers/lib/_get_prototype_of.js").default;
var _inheritsMjs = require("@swc/helpers/lib/_inherits.js").default;
var _wrapNativeSuperMjs = require("@swc/helpers/lib/_wrap_native_super.js").default;
var _createSuperMjs = require("@swc/helpers/lib/_create_super.js").default;
"use strict";
var Element = /*#__PURE__*/ function() {
    function Element() {
        _classCallCheckMjs(this, Element);
    }
    _createClassMjs(Element, [
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
    _inheritsMjs(CanvasElement, Element);
    var _super = _createSuperMjs(CanvasElement);
    function CanvasElement() {
        _classCallCheckMjs(this, CanvasElement);
        return _super.apply(this, arguments);
    }
    _createClassMjs(CanvasElement, [
        {
            key: "createFacets",
            value: function createFacets(hidden) {
                var childElements = this.getChildElements();
            ///
            }
        }
    ]);
    return CanvasElement;
}(_wrapNativeSuperMjs(Element));
var ColouredCanvasElement = /*#__PURE__*/ function(CanvasElement) {
    _inheritsMjs(ColouredCanvasElement, CanvasElement);
    var _super = _createSuperMjs(ColouredCanvasElement);
    function ColouredCanvasElement() {
        _classCallCheckMjs(this, ColouredCanvasElement);
        return _super.apply(this, arguments);
    }
    _createClassMjs(ColouredCanvasElement, [
        {
            key: "createFacets",
            value: function createFacets(hidden) {
                hidden = _getMjs(_getPrototypeOfMjs(ColouredCanvasElement.prototype), "createFacets", this).call(this, hidden); ///
            ///
            }
        }
    ]);
    return ColouredCanvasElement;
}(CanvasElement);
var ColouredSquare = /*#__PURE__*/ function(ColouredCanvasElement) {
    _inheritsMjs(ColouredSquare, ColouredCanvasElement);
    var _super = _createSuperMjs(ColouredSquare);
    function ColouredSquare() {
        _classCallCheckMjs(this, ColouredSquare);
        return _super.apply(this, arguments);
    }
    return ColouredSquare;
}(ColouredCanvasElement);
var bugExample = function() {
    var colouredSquare = new ColouredSquare(), hidden = false;
    colouredSquare.createFacets(hidden);
};
bugExample();
