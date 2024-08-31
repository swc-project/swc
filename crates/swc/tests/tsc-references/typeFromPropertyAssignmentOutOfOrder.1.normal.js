//// [index.js]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
First.Item = function I() {
    "use strict";
    _class_call_check(this, I);
};
Common.Object = /*#__PURE__*/ function(_First_Item) {
    "use strict";
    _inherits(_class, _First_Item);
    function _class() {
        _class_call_check(this, _class);
        return _call_super(this, _class, arguments);
    }
    return _class;
}(First.Item);
Workspace.Object = /*#__PURE__*/ function(_Common_Object) {
    "use strict";
    _inherits(_class, _Common_Object);
    function _class() {
        _class_call_check(this, _class);
        return _call_super(this, _class, arguments);
    }
    return _class;
}(Common.Object);
/** @type {Workspace.Object} */ var am;
//// [roots.js]
var First = {};
var Common = {};
var Workspace = {};
