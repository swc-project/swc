import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var UI = {};
UI.TreeElement = function _class() {
    "use strict";
    _class_call_check(this, _class), this.treeOutline = 12;
}, UI.context = new UI.TreeElement();
var C = function(_TreeElement) {
    "use strict";
    _inherits(C, _TreeElement);
    var _super = _create_super(C);
    function C() {
        return _class_call_check(this, C), _super.apply(this, arguments);
    }
    return C.prototype.onpopulate = function() {
        this.doesNotExist, this.treeOutline.doesntExistEither();
    }, C;
}(UI.TreeElement);
