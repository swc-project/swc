"use strict";
var _classCallCheckMjs = require("@swc/helpers/lib/_class_call_check.js");
var _createClassMjs = require("@swc/helpers/lib/_create_class.js");
var _getMjs = require("@swc/helpers/lib/_get.js");
var _getPrototypeOfMjs = require("@swc/helpers/lib/_get_prototype_of.js");
var _inheritsMjs = require("@swc/helpers/lib/_inherits.js");
var _createSuperMjs = require("@swc/helpers/lib/_create_super.js");
var ColouredCanvasElement = /*#__PURE__*/ function(CanvasElement1) {
    "use strict";
    (0, _inheritsMjs.default)(ColouredCanvasElement, CanvasElement1);
    var _super = (0, _createSuperMjs.default)(ColouredCanvasElement);
    function ColouredCanvasElement() {
        (0, _classCallCheckMjs.default)(this, ColouredCanvasElement);
        return _super.apply(this, arguments);
    }
    (0, _createClassMjs.default)(ColouredCanvasElement, [
        {
            key: "createFacets",
            value: function createFacets(hidden) {
                hidden = (0, _getMjs.default)((0, _getPrototypeOfMjs.default)(ColouredCanvasElement.prototype), "createFacets", this).call(this, hidden);
            }
        }
    ]);
    return ColouredCanvasElement;
}(CanvasElement);
