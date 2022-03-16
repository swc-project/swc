import * as swcHelpers from "@swc/helpers";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @target: es3
// @filename: index.js
First.Item = function I() {
    "use strict";
    swcHelpers.classCallCheck(this, I);
};
Common.Object = /*#__PURE__*/ function(_Item) {
    "use strict";
    swcHelpers.inherits(_class, _Item);
    var _super = swcHelpers.createSuper(_class);
    function _class() {
        swcHelpers.classCallCheck(this, _class);
        return _super.apply(this, arguments);
    }
    return _class;
}(First.Item);
Workspace.Object = /*#__PURE__*/ function(_Object) {
    "use strict";
    swcHelpers.inherits(_class, _Object);
    var _super = swcHelpers.createSuper(_class);
    function _class() {
        swcHelpers.classCallCheck(this, _class);
        return _super.apply(this, arguments);
    }
    return _class;
}(Common.Object);
/** @type {Workspace.Object} */ var am;
// @filename: roots.js
var First = {};
var Common = {};
var Workspace = {};
