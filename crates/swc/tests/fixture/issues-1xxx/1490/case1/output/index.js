"use strict";
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
var _createClass = require("@swc/helpers/lib/_create_class.js").default;
var _get = require("@swc/helpers/lib/_get.js").default;
var _getPrototypeOf = require("@swc/helpers/lib/_get_prototype_of.js").default;
var _inherits = require("@swc/helpers/lib/_inherits.js").default;
var _createSuper = require("@swc/helpers/lib/_create_super.js").default;
var ColouredCanvasElement = /*#__PURE__*/ function(CanvasElement1) {
    "use strict";
    _inherits(ColouredCanvasElement, CanvasElement1);
    var _super = _createSuper(ColouredCanvasElement);
    function ColouredCanvasElement() {
        _classCallCheck(this, ColouredCanvasElement);
        return _super.apply(this, arguments);
    }
    _createClass(ColouredCanvasElement, [
        {
            key: "createFacets",
            value: function createFacets(hidden) {
                hidden = _get(_getPrototypeOf(ColouredCanvasElement.prototype), "createFacets", this).call(this, hidden);
            }
        }
    ]);
    return ColouredCanvasElement;
}(CanvasElement);
