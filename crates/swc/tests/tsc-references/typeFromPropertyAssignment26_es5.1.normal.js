import * as swcHelpers from "@swc/helpers";
// @noEmit: true
// @noImplicitAny: true
// @checkJs: true
// @allowJs: true
// @Filename: bug24730.js
var UI = {};
UI.TreeElement = function _class() {
    "use strict";
    swcHelpers.classCallCheck(this, _class);
    this.treeOutline = 12;
};
UI.context = new UI.TreeElement();
var C = /*#__PURE__*/ function(_TreeElement) {
    "use strict";
    swcHelpers.inherits(C, _TreeElement);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(C, [
        {
            key: "onpopulate",
            value: function onpopulate() {
                this.doesNotExist;
                this.treeOutline.doesntExistEither();
            }
        }
    ]);
    return C;
}(UI.TreeElement);
