//// [index.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
First.Item = function I() {
    "use strict";
    _class_call_check(this, I);
};
Common.Object = /*#__PURE__*/ function(_First_Item) {
    "use strict";
    _inherits(_class, _First_Item);
    var _super = _create_super(_class);
    function _class() {
        _class_call_check(this, _class);
        return _super.apply(this, arguments);
    }
    return _class;
}(First.Item);
Workspace.Object = /*#__PURE__*/ function(_Common_Object) {
    "use strict";
    _inherits(_class, _Common_Object);
    var _super = _create_super(_class);
    function _class() {
        _class_call_check(this, _class);
        return _super.apply(this, arguments);
    }
    return _class;
}(Common.Object);
/** @type {Workspace.Object} */ var am;
//// [roots.js]
var First = {};
var Common = {};
var Workspace = {};
