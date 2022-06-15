"use strict";
var _class_call_check = require("@swc/helpers/lib/_class_call_check.js").default;
var _create_class = require("@swc/helpers/lib/_create_class.js").default;
var _get = require("@swc/helpers/lib/_get.js").default;
var _get_prototype_of = require("@swc/helpers/lib/_get_prototype_of.js").default;
var _inherits = require("@swc/helpers/lib/_inherits.js").default;
var _create_super = require("@swc/helpers/lib/_create_super.js").default;
var ColouredCanvasElement = /*#__PURE__*/ function(CanvasElement1) {
    "use strict";
    _inherits(ColouredCanvasElement, CanvasElement1);
    var _super = _create_super(ColouredCanvasElement);
    function ColouredCanvasElement() {
        _class_call_check(this, ColouredCanvasElement);
        return _super.apply(this, arguments);
    }
    _create_class(ColouredCanvasElement, [
        {
            key: "createFacets",
            value: function createFacets(hidden) {
                hidden = _get(_get_prototype_of(ColouredCanvasElement.prototype), "createFacets", this).call(this, hidden);
            }
        }
    ]);
    return ColouredCanvasElement;
}(CanvasElement);
