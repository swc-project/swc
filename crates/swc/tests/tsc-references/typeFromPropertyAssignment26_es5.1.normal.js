import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @noEmit: true
// @noImplicitAny: true
// @checkJs: true
// @allowJs: true
// @Filename: bug24730.js
var UI = {};
UI.TreeElement = function _class() {
    "use strict";
    _class_call_check(this, _class);
    this.treeOutline = 12;
};
UI.context = new UI.TreeElement();
var C = /*#__PURE__*/ function(_TreeElement) {
    "use strict";
    _inherits(C, _TreeElement);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    _proto.onpopulate = function onpopulate() {
        this.doesNotExist;
        this.treeOutline.doesntExistEither();
    };
    return C;
}(UI.TreeElement);
