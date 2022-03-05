"use strict";
var swcHelpers = require("@swc/helpers");
var ColouredCanvasElement = /*#__PURE__*/ function(CanvasElement) {
    "use strict";
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
                hidden = swcHelpers.get(swcHelpers.getPrototypeOf(ColouredCanvasElement.prototype), "createFacets", this).call(this, hidden);
            }
        }
    ]);
    return ColouredCanvasElement;
}(CanvasElement);
