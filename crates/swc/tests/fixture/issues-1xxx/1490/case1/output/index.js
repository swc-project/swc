var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var _get = require("@swc/helpers/_/_get");
var _get_prototype_of = require("@swc/helpers/_/_get_prototype_of");
var _inherits = require("@swc/helpers/_/_inherits");
var _create_super = require("@swc/helpers/_/_create_super");
var ColouredCanvasElement = /*#__PURE__*/ function(CanvasElement1) {
    "use strict";
    _inherits._(ColouredCanvasElement, CanvasElement1);
    var _super = _create_super._(ColouredCanvasElement);
    function ColouredCanvasElement() {
        _class_call_check._(this, ColouredCanvasElement);
        return _super.apply(this, arguments);
    }
    _create_class._(ColouredCanvasElement, [
        {
            key: "createFacets",
            value: function createFacets(hidden) {
                hidden = _get._(_get_prototype_of._(ColouredCanvasElement.prototype), "createFacets", this).call(this, hidden);
            }
        }
    ]);
    return ColouredCanvasElement;
}(CanvasElement);
