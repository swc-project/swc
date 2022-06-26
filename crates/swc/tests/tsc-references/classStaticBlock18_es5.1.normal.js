import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @target: esnext, es2022, es2015, es5
function foo() {
    var _class, __;
    return _class = function _class() {
        "use strict";
        _class_call_check(this, _class);
    }, _class.foo = 1, __ = {
        writable: true,
        value: function() {
            var _class1, __;
            var c = (_class1 = function _class() {
                "use strict";
                _class_call_check(this, _class);
            }, _class1.bar = 2, __ = {
                writable: true,
                value: function() {
                // do
                }()
            }, _class1);
        }()
    }, _class;
}
