//// [bug24730.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var UI = {};
UI.TreeElement = function _class() {
    "use strict";
    _class_call_check(this, _class);
    this.treeOutline = 12;
};
UI.context = new UI.TreeElement();
var C = /*#__PURE__*/ function(_UI_TreeElement) {
    "use strict";
    _inherits(C, _UI_TreeElement);
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
