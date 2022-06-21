"use strict";
var _classCallCheckMjs = require("@swc/helpers/lib/_class_call_check.js").default;
var _createClassMjs = require("@swc/helpers/lib/_create_class.js").default;
var _getMjs = require("@swc/helpers/lib/_get.js").default;
var _getPrototypeOfMjs = require("@swc/helpers/lib/_get_prototype_of.js").default;
var _inheritsMjs = require("@swc/helpers/lib/_inherits.js").default;
var _createSuperMjs = require("@swc/helpers/lib/_create_super.js").default;
var ColouredCanvasElement = /*#__PURE__*/ function(CanvasElement1) {
    "use strict";
    _inheritsMjs(ColouredCanvasElement, CanvasElement1);
    var _super = _createSuperMjs(ColouredCanvasElement);
    function ColouredCanvasElement() {
        _classCallCheckMjs(this, ColouredCanvasElement);
        return _super.apply(this, arguments);
    }
    _createClassMjs(ColouredCanvasElement, [
        {
            key: "createFacets",
            value: function createFacets(hidden) {
                hidden = _getMjs(_getPrototypeOfMjs(ColouredCanvasElement.prototype), "createFacets", this).call(this, hidden);
            }
        }
    ]);
    return ColouredCanvasElement;
}(CanvasElement);
