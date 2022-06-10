import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @target: es3
// @filename: index.js
First.Item = function I() {
    "use strict";
    _class_call_check(this, I);
};
Common.Object = /*#__PURE__*/ function(_Item) {
    "use strict";
    _inherits(_class, _Item);
    var _super = _create_super(_class);
    function _class() {
        _class_call_check(this, _class);
        return _super.apply(this, arguments);
    }
    return _class;
}(First.Item);
Workspace.Object = /*#__PURE__*/ function(_Object) {
    "use strict";
    _inherits(_class, _Object);
    var _super = _create_super(_class);
    function _class() {
        _class_call_check(this, _class);
        return _super.apply(this, arguments);
    }
    return _class;
}(Common.Object);
/** @type {Workspace.Object} */ var am;
// @filename: roots.js
var First = {};
var Common = {};
var Workspace = {};
