//// [classStaticBlock18.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function foo() {
    var _class;
    return _class = function _class() {
        "use strict";
        _class_call_check(this, _class);
    }, function() {
        _class.foo = 1;
    }(), function() {
        var _class;
        var c = (_class = function _class() {
            "use strict";
            _class_call_check(this, _class);
        }, function() {
            _class.bar = 2;
        }(), function() {
        // do
        }(), _class);
    }(), _class;
}
