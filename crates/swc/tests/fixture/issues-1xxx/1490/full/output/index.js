var _classCallCheckMjs = require("@swc/helpers/lib/_class_call_check.js");
var _createClassMjs = require("@swc/helpers/lib/_create_class.js");
var _getMjs = require("@swc/helpers/lib/_get.js");
var _getPrototypeOfMjs = require("@swc/helpers/lib/_get_prototype_of.js");
var _inheritsMjs = require("@swc/helpers/lib/_inherits.js");
var _wrapNativeSuperMjs = require("@swc/helpers/lib/_wrap_native_super.js");
var _createSuperMjs = require("@swc/helpers/lib/_create_super.js");
"use strict";
var Element = /*#__PURE__*/ function() {
    function Element() {
        (0, _classCallCheckMjs.default)(this, Element);
    }
    (0, _createClassMjs.default)(Element, [
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
    (0, _inheritsMjs.default)(CanvasElement, Element);
    var _super = (0, _createSuperMjs.default)(CanvasElement);
    function CanvasElement() {
        (0, _classCallCheckMjs.default)(this, CanvasElement);
        return _super.apply(this, arguments);
    }
    (0, _createClassMjs.default)(CanvasElement, [
        {
            key: "createFacets",
            value: function createFacets(hidden) {
                var childElements = this.getChildElements();
            ///
            }
        }
    ]);
    return CanvasElement;
}((0, _wrapNativeSuperMjs.default)(Element));
var ColouredCanvasElement = /*#__PURE__*/ function(CanvasElement) {
    (0, _inheritsMjs.default)(ColouredCanvasElement, CanvasElement);
    var _super = (0, _createSuperMjs.default)(ColouredCanvasElement);
    function ColouredCanvasElement() {
        (0, _classCallCheckMjs.default)(this, ColouredCanvasElement);
        return _super.apply(this, arguments);
    }
    (0, _createClassMjs.default)(ColouredCanvasElement, [
        {
            key: "createFacets",
            value: function createFacets(hidden) {
                hidden = (0, _getMjs.default)((0, _getPrototypeOfMjs.default)(ColouredCanvasElement.prototype), "createFacets", this).call(this, hidden); ///
            ///
            }
        }
    ]);
    return ColouredCanvasElement;
}(CanvasElement);
var ColouredSquare = /*#__PURE__*/ function(ColouredCanvasElement) {
    (0, _inheritsMjs.default)(ColouredSquare, ColouredCanvasElement);
    var _super = (0, _createSuperMjs.default)(ColouredSquare);
    function ColouredSquare() {
        (0, _classCallCheckMjs.default)(this, ColouredSquare);
        return _super.apply(this, arguments);
    }
    return ColouredSquare;
}(ColouredCanvasElement);
var bugExample = function() {
    var colouredSquare = new ColouredSquare(), hidden = false;
    colouredSquare.createFacets(hidden);
};
bugExample();
