//// [override3.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(B1) {
    "use strict";
    _inherits(DB, B1);
    var _super = _create_super(DB);
    function DB() {
        return _class_call_check(this, DB), _super.apply(this, arguments);
    }
    var _proto = DB.prototype;
    return _proto.foo = function() {}, _proto.bar = function() {}, DB;
}(B);
