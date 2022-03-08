import * as swcHelpers from "@swc/helpers";
var UI = {};
UI.TreeElement = function _class() {
    "use strict";
    swcHelpers.classCallCheck(this, _class), this.treeOutline = 12;
}, UI.context = new UI.TreeElement();
var C = function(_TreeElement) {
    "use strict";
    swcHelpers.inherits(C, _TreeElement);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    return C.prototype.onpopulate = function() {
        this.doesNotExist, this.treeOutline.doesntExistEither();
    }, C;
}(UI.TreeElement);
